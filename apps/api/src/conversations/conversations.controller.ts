import { Controller, Req, Get, UseGuards, Inject } from '@nestjs/common';
import type { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
    constructor(
        private readonly db: DatabaseService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

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