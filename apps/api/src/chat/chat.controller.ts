import { Controller, Post, Body, Req, UseGuards, Get, Inject } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SelectedEventsDto } from 'src/generate-prompts/dto/selected-events.dto';
import { Messages } from './dto/Messages';
import type { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { LLMQuotaGuard } from 'src/llm-quota/llm-quota.guard';
import { LLMQuotaService } from 'src/llm-quota/llm-quota.service';
import { UserThrottlerGuard } from 'src/guards/user-throttler.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('chat')
@UseGuards(JwtAuthGuard,  UserThrottlerGuard, LLMQuotaGuard)
export class ChatController {

  constructor(
    private readonly chatService: ChatService, 
    private readonly db: DatabaseService,
    private readonly quotaService: LLMQuotaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) { }

  @Throttle({
    chat: {
      limit: 4,
      ttl: 1000
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

  @Post('history')
  async fetchMessages(
    @Body("conversationId") conversationId: string,
) {

      const cacheKey = `messages:conversation:${conversationId}`;
     const cachedData = await this.cacheManager.get(cacheKey);
     if(cachedData) {
      console.log("rendering chat history from cache");
      return cachedData;
     }

     console.log("rendering from db")
     const result = await this.db.query(
      `SELECT id, message_type, content, selected_events
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC
      `, [conversationId]
     )


  
    await this.cacheManager.set(cacheKey, result.rows, 220000);
     return result.rows;
  }

   @Get('quota')
   async getQuota(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.quotaService.getRemainingQuota(userId);
  }
}