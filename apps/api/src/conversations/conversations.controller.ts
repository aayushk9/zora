import { Controller, Req, Get, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
    constructor(private readonly db: DatabaseService) { }
  
    @Get()
    async fetchConversations(@Req() req: Request) {
       
        const userId = (req.user as any).userId;

        const result = await this.db.query(
            `SELECT id, title 
             FROM conversations
             WHERE user_id = $1
             ORDER BY created_at DESC
            `, [userId]
        )
        return result.rows
    }
}