import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SelectedEventsDto } from 'src/generate-prompts/dto/selected-events.dto';
import { Messages } from './dto/Messages';
import type { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { LLMQuotaGuard } from 'src/llm-quota/llm-quota.guard';
import { LLMQuotaService } from 'src/llm-quota/llm-quota.service';

@Controller('chat')
@UseGuards(JwtAuthGuard, LLMQuotaGuard)
export class ChatController {

  constructor(
    private readonly chatService: ChatService, 
    private readonly db: DatabaseService,
    private readonly quotaService: LLMQuotaService
  ) { }

  @Throttle({
    chat: {
      limit: 3,
      ttl: 60
    }
  })
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

  @Throttle({
    default: {
      limit: 60,
      ttl: 60
    }
  })
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

   @Get('quota')
   async getQuota(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.quotaService.getRemainingQuota(userId);
  }
}