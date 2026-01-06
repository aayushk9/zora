import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { OpenAIModule } from 'src/openai/openai.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [HttpModule, OpenAIModule]
})
export class ChatModule {}
