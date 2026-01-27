import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { GeneratePromptsModule } from './generate-prompts/generate-prompts.module';
import { ChatModule } from './chat/chat.module';
import { OpenAIModule } from './openai/openai.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GroqModule } from './groq/groq.module';
import { ConversationsModule } from './conversations/conversations.module';
import { LLMQuotaModule } from './llm-quota/llm-quota.module';
import { HealthModule } from './health/health.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({

  imports: [
    InfrastructureModule,
    EventsModule,
    GeneratePromptsModule,
    HealthModule,
    ChatModule,
    OpenAIModule,
    AuthModule,
    DatabaseModule,
    GroqModule,
    ConversationsModule,
    LLMQuotaModule,
  ],
  controllers: [AppController],
  providers: [AppService]

})

export class AppModule { }