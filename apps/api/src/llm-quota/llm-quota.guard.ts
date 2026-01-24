import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { LLMQuotaService } from './llm-quota.service';
import { Messages } from "../chat/dto/Messages"

@Injectable()
export class LLMQuotaGuard implements CanActivate {

  private static globalRequestCount = 0;
  private static globalTokenCount = 0;
  private static globalResetTime = Date.now() + 60000; // 1 minute

  constructor(private quotaService: LLMQuotaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId: string | null = req.user?.userId ?? 'anonymous';

    const messages: Messages[] = req.body?.messages ?? [];
    const allContent = messages.map(m => m.content).join(' ');

    const estimatedTokens = Math.ceil(allContent.length / 4);


    // ← ADD THIS: Check global API limits first
    this.checkGlobalApiLimits(estimatedTokens);
    this.quotaService.checkQuota(userId, estimatedTokens);

    return true; 
  }

  private checkGlobalApiLimits(tokensNeeded: number) {
    const now = Date.now();
    
    // Reset counters every minute
    if (now > LLMQuotaGuard.globalResetTime) {
      LLMQuotaGuard.globalRequestCount = 0;
      LLMQuotaGuard.globalTokenCount = 0;
      LLMQuotaGuard.globalResetTime = now + 60000;
    }

    // Check Groq API limits (with safety buffer)
    // Groq limit: 30 RPM, 20K TPM
    if (LLMQuotaGuard.globalRequestCount >= 25) { // Buffer: 25/30
      throw new HttpException(
        'System is temporarily busy. Please try again in a moment.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    if (LLMQuotaGuard.globalTokenCount + tokensNeeded > 18000) { // Buffer: 18K/20K
      throw new HttpException(
        'System token limit reached. Please try again shortly.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Increment counters
    LLMQuotaGuard.globalRequestCount++;
    LLMQuotaGuard.globalTokenCount += tokensNeeded;
  }
}