import { Test, TestingModule } from '@nestjs/testing';
import { LLMQuotaService } from './llm-quota.service';

describe('LlmQuotaService', () => {
  let service: LLMQuotaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LLMQuotaService],
    }).compile();

    service = module.get<LLMQuotaService>(LLMQuotaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
