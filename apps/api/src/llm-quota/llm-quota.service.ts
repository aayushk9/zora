import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

interface UserQuota {
  used: number;
  limit: number;
  resetAt: Date;
}

@Injectable()
export class LLMQuotaService {

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) { }

  private getKey(userId: string | null) {
    return `quota:${userId ?? "anonymous"}`;
  }

  private getNextResetTime(): Date {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  async getUserQuota(userId: string | null): Promise<UserQuota> { // resposible for managing user quota and using caching
    const key = this.getKey(userId);

    let quota = await this.cacheManager.get<UserQuota>(key); // access cached data (user quota)

    if (!quota) {
      quota = {
        used: 0,
        limit: 10000,
        resetAt: this.getNextResetTime(),
      }

      const ttlSeconds = Math.ceil(
        (quota.resetAt.getTime() - Date.now()) / 1000
      )

      await this.cacheManager.set(key, quota, ttlSeconds); // set data in cache with timer
      return quota;
    }

    if (new Date() >= new Date(quota.resetAt)) {
      quota.used = 0;
      quota.resetAt = this.getNextResetTime();

      const ttlSeconds = Math.ceil(
        (quota.resetAt.getTime() - Date.now()) / 1000
      );

      await this.cacheManager.set(key, quota, ttlSeconds);
    }

    return quota;
  }

  async checkQuota(userId: string | null, tokensNeeded: number) { // runs on gaurd checks if tokensUsed > limit return 403
    const quota = await this.getUserQuota(userId);

    if (quota.used + tokensNeeded > quota.limit) {
      const resetInMinutes = Math.ceil(
        (new Date(quota.resetAt).getTime() - Date.now()) / 1000 / 60
      );

      throw new ForbiddenException({  // 403 forbidden
        code: 'LLM_QUOTA_EXCEEDED',
        message: `Chat quota exceeded. You've used ${quota.used}/${quota.limit} tokens. Resets in ${resetInMinutes} minutes`,
        limit: quota.limit,
        used: quota.used,
        resetAt: quota.resetAt
      });
    }
  }

  async consumeTokens(userId: string | null, tokensUsed: number) { // receiving tokensUsed from groq & adding to userQuota via getUserQuota(userId).used += tokensUsed
    const key = this.getKey(userId);
    const quota = await this.getUserQuota(userId);

    quota.used += tokensUsed;

    const ttlSeconds = Math.ceil(
      (quota.resetAt.getTime() - Date.now()) / 1000
    );

    await this.cacheManager.set(key, quota, ttlSeconds)
  }

  async getRemainingQuota(userId: string | null) { // call getUserQuota to fetch user remaining quota and when to reset at
    const quota = await this.getUserQuota(userId);

    return {
      remaining: Math.max(0, quota.limit - quota.used),
      limit: quota.limit,
      resetAt: quota.resetAt,
    };
  }
}
