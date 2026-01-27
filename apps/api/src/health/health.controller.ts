import { Controller, Get, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('health')
export class HealthController {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) { }

    @Get('redis')
    async checkRedis() {
        const testKey = 'health-check-test';
        const testValue = {
            message: 'Redis is working!',
            timestamp: new Date().toISOString(),
        };

        try {
            await this.cacheManager.set(testKey, testValue, 10000);
            const retrieved = await this.cacheManager.get(testKey);
            await this.cacheManager.del(testKey);

            return {
                status: 'healthy',
                message: 'Redis connection successful',
                operations: {
                    set: '',
                    get: '',
                    delete: '',
                },
                retrievedValue: retrieved,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                message: 'Redis connection failed',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            };
        }
    }

    @Get('cache-stats')
    async getCacheStats() {
        return {
            message: 'Use Redis CLI in Upstash dashboard to see cache contents',
            upstashDashboard: 'https://console.upstash.com/redis',
        };
    }
}