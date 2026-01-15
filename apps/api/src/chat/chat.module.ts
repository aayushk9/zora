import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { OpenAIModule } from 'src/openai/openai.module';
import { DatabaseService } from 'src/database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { GroqModule } from 'src/groq/groq.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, DatabaseService],
  imports: [HttpModule, OpenAIModule,
     JwtModule.register({
        secret: process.env.JWT_SECRET!,
        signOptions: { expiresIn: '10d'}
       }),
     GroqModule
  ]
})
export class ChatModule {}