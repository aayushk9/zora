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

@Module({
  imports: [
    EventsModule, 
    GeneratePromptsModule, 
    ConfigModule.forRoot({
     isGlobal: true,
  }), 
  ChatModule, OpenAIModule, AuthModule, DatabaseModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
