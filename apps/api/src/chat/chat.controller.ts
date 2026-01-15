import { Controller, Post, Body, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SelectedEventsDto } from 'src/generate-prompts/dto/selected-events.dto';
import { Messages } from './dto/Messages';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Controller('chat')
export class ChatController {

  constructor(private readonly chatService: ChatService, private readonly jwt: JwtService, private readonly db: DatabaseService) { }

  @Post()
  async sendResponse(
    @Body('messages') messages: Messages[],
    @Body('selectedEvents') selectedEvents: SelectedEventsDto[],
    @Req() req: Request,
    @Body("conversationId") conversationId: string
  ) 
  {
    const token = req.cookies?.jwt ?? null;

    let userId: string | null = null;
    if (token) {
      try {
        const user = this.jwt.verify(token);
        userId = user.sub;
      } catch { }
    }
    return await this.chatService.fetchResponse(
      messages,
      selectedEvents,
      userId,
      conversationId
    )
  }

  @Post('history')
  async fetchMessages(@Body("conversationId") conversationId: string) {
     // user authenticated earlier

     const result = await this.db.query(
      `SELECT message_type, content
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC
      `, [conversationId]
     )

     return result.rows;
  }
}
