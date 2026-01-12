import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { OpenAIModule } from 'src/openai/openai.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, DatabaseService],
  imports: [HttpModule, OpenAIModule]
})
export class ChatModule {}
