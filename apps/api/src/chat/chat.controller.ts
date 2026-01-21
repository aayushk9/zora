import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SelectedEventsDto } from 'src/generate-prompts/dto/selected-events.dto';
import { Messages } from './dto/Messages';
import type { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {

  constructor(private readonly chatService: ChatService, private readonly db: DatabaseService) { }

  @Post()
  async sendResponse(
    @Body('messages') messages: Messages[],
    @Body('selectedEvents') selectedEvents: SelectedEventsDto[],
    @Req() req: Request,
    @Body("conversationId") conversationId: string
  ) 
  {

    const userId = (req.user as any).userId;
    
    return await this.chatService.fetchResponse(
      messages,
      selectedEvents,
      userId,
      conversationId
    )
  }

  @Post('history')
  async fetchMessages(
    @Body("conversationId") conversationId: string,
) {
     const result = await this.db.query(
      `SELECT id, message_type, content, selected_events
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC
      `, [conversationId]
     )
  
     console.log(result.rows)
     return result.rows;
  }
}