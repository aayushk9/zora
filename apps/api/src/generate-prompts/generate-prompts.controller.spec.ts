import { Test, TestingModule } from '@nestjs/testing';
import { GeneratePromptsController } from './generate-prompts.controller';

describe('GeneratePromptsController', () => {
  let controller: GeneratePromptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratePromptsController],
    }).compile();

    controller = module.get<GeneratePromptsController>(GeneratePromptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
