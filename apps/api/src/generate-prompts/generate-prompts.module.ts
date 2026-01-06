import { Module } from '@nestjs/common';
import { GeneratePromptsController } from './generate-prompts.controller';
import { GeneratePromptsService } from './generate-prompts.service';
import { HttpModule } from '@nestjs/axios';
import { OpenAIModule } from 'src/openai/openai.module';

@Module({
  imports: [HttpModule, OpenAIModule],
  controllers: [GeneratePromptsController],
  providers: [GeneratePromptsService]
})
export class GeneratePromptsModule {}
