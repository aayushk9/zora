import { Module } from '@nestjs/common';
import { GeneratePromptsController } from './generate-prompts.controller';
import { GeneratePromptsService } from './generate-prompts.service';
import { HttpModule } from '@nestjs/axios';
import { GroqModule } from 'src/groq/groq.module';

@Module({
  imports: [HttpModule, GroqModule],
  controllers: [GeneratePromptsController],
  providers: [GeneratePromptsService]
})
export class GeneratePromptsModule {}
