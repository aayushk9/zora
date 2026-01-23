import { Injectable, ForbiddenException } from '@nestjs/common';

interface UserQuota {
  used: number;
  limit: number;
}

@Injectable()
export class LLMQuotaService {
  // TEMP in-memory store (later DB / Redis)
  private store = new Map<string | null, UserQuota>();

  getUserQuota(userId: string | null ): UserQuota {
    if (!this.store.has(userId)) {
      this.store.set(userId, {
        used: 0,
        limit: 10_000, // tokens per day (basic)
      });
    }

    return this.store.get(userId)!;
  }

  checkQuota(userId: string | null, tokensNeeded: number) {
    const quota = this.getUserQuota(userId);

    if (quota.used + tokensNeeded > quota.limit) {  
      throw new ForbiddenException({  // 403 forbidden
        code: 'LLM_QUOTA_EXCEEDED',
        message: 'Chat quota exceeded',
      });
    }
  }

  consumeTokens(userId: string | null, tokensUsed: number) {
    const quota = this.getUserQuota(userId);
    quota.used += tokensUsed;
  }
}
