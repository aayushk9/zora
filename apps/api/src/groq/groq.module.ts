import { Module } from '@nestjs/common';
import { GROQProvider } from './groq.provider';

@Module({
  providers: [GROQProvider],
  exports: [GROQProvider]
})
export class GroqModule {}
