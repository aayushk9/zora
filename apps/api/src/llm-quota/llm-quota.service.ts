import { Injectable, ForbiddenException } from '@nestjs/common';

interface UserQuota {
  used: number;
  limit: number;
  resetAt: Date;
}

@Injectable()
export class LLMQuotaService {
  // TEMP in-memory store (later DB / Redis)
  private store = new Map<string | null, UserQuota>();

  getUserQuota(userId: string | null): UserQuota {
    if (!this.store.has(userId)) {
      this.store.set(userId, {
        used: 0,
        limit: 10000, // tokens per day (basic)
        resetAt: this.getNextResetTime()
      });
    }

    const quota = this.store.get(userId)!;

    // Auto-reset if past reset time
    if (new Date() >= quota.resetAt) {
      quota.used = 0;
      quota.resetAt = this.getNextResetTime();
    }

    return quota;
  }

  checkQuota(userId: string | null, tokensNeeded: number) {
    const quota = this.getUserQuota(userId);

    if (quota.used + tokensNeeded > quota.limit) {
      const resetIn = Math.ceil((quota.resetAt.getTime() - Date.now()) / 1000 / 60); // minutes 
      throw new ForbiddenException({  // 403 forbidden
        code: 'LLM_QUOTA_EXCEEDED',
        message: `Chat quota exceeded. You've used ${quota.used}/${quota.limit} tokens. Resets in ${resetIn} minutes`,
        limit: quota.limit, 
        used: quota.used,
        resetAt: quota.resetAt
      });
    }
  }

  consumeTokens(userId: string | null, tokensUsed: number) {
    const quota = this.getUserQuota(userId);
    quota.used += tokensUsed;
  }

  getRemainingQuota(userId: string | null): { remaining: number; limit: number; resetAt: Date } {
    const quota = this.getUserQuota(userId);
    return {
      remaining: Math.max(0, quota.limit - quota.used),
      limit: quota.limit,
      resetAt: quota.resetAt,
    };
  }

  private getNextResetTime(): Date {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Reset at midnight
    return tomorrow;
  }
}
