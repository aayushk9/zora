import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { LLMQuotaService } from './llm-quota.service';
import { Messages } from "../chat/dto/Messages"

@Injectable()
export class LLMQuotaGuard implements CanActivate {

  constructor(private quotaService: LLMQuotaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId: string | null = req.user?.userId ?? 'anonymous';

    const messages: Messages[] = req.body?.messages ?? [];
    const allContent = messages.map(m => m.content).join(' ');

    const estimatedTokens = Math.ceil(allContent.length / 4);
    this.quotaService.checkQuota(userId, estimatedTokens);

    return true; 
  }
}