import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService, DatabaseService],
  imports: [ JwtModule.register({
        secret: process.env.JWT_SECRET!,
        signOptions: { expiresIn: '10d'}
       }),]
})
export class ConversationsModule {}
