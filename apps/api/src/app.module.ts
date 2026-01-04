import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { GeneratePromptsModule } from './generate-prompts/generate-prompts.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [EventsModule, GeneratePromptsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
