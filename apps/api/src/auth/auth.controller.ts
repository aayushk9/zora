import { Controller, Body, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    async signin(
        @Body("email") email: string,
        @Body("password") password: string,
        @Res({ passthrough: true }) res: Response
    ) {

        const result = await this.authService.signIn(email, password)

        if (result.message === 'Invalid credentials') {
            return res.status(401).json(result);
        }

        res.cookie('jwt', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000,  // 1- days
        });

        return res.status(200).json({ message: result.message });
    }
}
