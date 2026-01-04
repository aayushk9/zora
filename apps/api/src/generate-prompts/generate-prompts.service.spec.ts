import { Test, TestingModule } from '@nestjs/testing';
import { GeneratePromptsService } from './generate-prompts.service';

describe('GeneratePromptsService', () => {
  let service: GeneratePromptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratePromptsService],
    }).compile();

    service = module.get<GeneratePromptsService>(GeneratePromptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
