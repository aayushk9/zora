import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';

import redisConfig from '../config/redis.config';

@Module({
  imports: [
    // global config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
    }),

    // redis cache logic
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redis = configService.get('redis');

        if (!redis?.url) {
          throw new Error('UPSTASH_REDIS_URL is missing');
        }

        console.log('Connecting to Redis (Upstash)…');

        const store = await redisStore({
          url: redis.url,
          ttl: redis.ttl,
        });

        console.log('Redis store initialized');
        return { store };
      },
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      { name: 'chat', ttl: 60, limit: 3 },
      { name: 'generatePrompts', ttl: 60, limit: 10 },
      { name: 'default', ttl: 60, limit: 60 },
    ]),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})

export class InfrastructureModule {}