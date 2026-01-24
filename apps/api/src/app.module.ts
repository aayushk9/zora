import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { GeneratePromptsModule } from './generate-prompts/generate-prompts.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { OpenAIModule } from './openai/openai.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GroqModule } from './groq/groq.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LLMQuotaModule } from './llm-quota/llm-quota.module';


@Module({
  imports: [
    EventsModule,
    GeneratePromptsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    OpenAIModule,
    AuthModule,
    DatabaseModule,
    GroqModule,
    ConversationsModule,
    ThrottlerModule.forRoot([
      {
        name: 'chat',
        ttl: 60,
        limit: 3, // 3 req/minute per IP
      },
      {
        name: 'default',
        ttl: 60,
        limit: 60 // 60 requests/per IP
      },
      {
        name: 'generatePrompts',
        ttl: 60,
        limit: 10
      }
    ]),
    LLMQuotaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ]
  ,
})
export class AppModule { }
