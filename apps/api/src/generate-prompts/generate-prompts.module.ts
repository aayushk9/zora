import { Module } from '@nestjs/common';
import { GeneratePromptsController } from './generate-prompts.controller';
import { GeneratePromptsService } from './generate-prompts.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GeneratePromptsController],
  providers: [GeneratePromptsService]
})
export class GeneratePromptsModule {}
