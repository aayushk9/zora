import { Controller, Body, Post, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';

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
            maxAge: 10 * 24 * 60 * 60 * 1000,  // 10 days
        });

        return res.status(200).json({ message: result.message });
    }

    @Get("me")
    me(@Req() req: Request) {
        return this.authService.getUserFromCookie(req);
    }

    @Post("logout")
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("jwt");
        return { success: true };
    }
}
