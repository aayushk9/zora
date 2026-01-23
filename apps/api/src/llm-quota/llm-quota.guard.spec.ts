import { Test, TestingModule } from '@nestjs/testing';
import { LLMQuotaGuard } from './llm-quota.guard';
import { LLMQuotaService } from './llm-quota.service';

describe('LLMQuotaGuard', () => {
  let guard: LLMQuotaGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LLMQuotaGuard,
        {
          provide: LLMQuotaService,
          useValue: {
            checkQuota: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<LLMQuotaGuard>(LLMQuotaGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
