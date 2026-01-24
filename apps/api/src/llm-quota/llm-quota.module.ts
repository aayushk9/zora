import { Module } from '@nestjs/common';
import { LLMQuotaService } from './llm-quota.service';
import { LLMQuotaGuard } from './llm-quota.guard';

@Module({
  providers: [LLMQuotaService, LLMQuotaGuard],
  exports: [LLMQuotaService, LLMQuotaGuard],
})
export class LLMQuotaModule {}