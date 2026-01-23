import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { LLMQuotaService } from './llm-quota.service';

@Injectable()
export class LLMQuotaGuard implements CanActivate {
  constructor(private quotaService: LLMQuotaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // BASIC assumption: user already authenticated
    const userId: string | null = req.user?.id ?? 'anonymous';

    // BASIC token estimate (replace later)
    const prompt: string = req.body?.prompt ?? '';
    const estimatedTokens = Math.ceil(prompt.length / 4);

    this.quotaService.checkQuota(userId, estimatedTokens);

    return true; 
  }
}