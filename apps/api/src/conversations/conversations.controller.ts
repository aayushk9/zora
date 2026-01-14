import { Controller, Req, Res, Post, Get, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly db: DatabaseService, private readonly jwt: JwtService) { }

    @Post()
    async fetchConversationId(@Req() req: Request) {

        const token = req.cookies['jwt'];
        if (!token) {
            throw new UnauthorizedException('JWT not found');
        }

        let user;
        try {
            user = this.jwt.verify(token)
        } catch {
            throw new UnauthorizedException("user not authenticated")
        }

        const result = await this.db.query(
            `INSERT INTO conversations (user_id, title)
             VALUES($1, 'New chat')
             RETURNING id, title
            `, [user.sub]
        )

        return {
            conversationId: result.rows[0].id,
            conversationTitle: result.rows[0].title
        }
    }

    @Get()
    async fetchConversations(@Req() req: Request) {
        const token = req.cookies["jwt"];

        if (!token) {
            throw new UnauthorizedException("jwt not found")
        }

        let user;
        try {
            user = this.jwt.verify(token)
        } catch {
            throw new UnauthorizedException("invalid jwt")
        }

        const result = await this.db.query(
            `SELECT id, title 
             FROM conversations
             WHERE user_id = $1
             ORDER BY created_at DESC
            `, [user.sub]
        )
        return result.rows
    }
}
