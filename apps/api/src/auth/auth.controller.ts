import { Controller, Body, Post, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { isProd, CLIENT_URL } from 'src/config/env';
import { GoogleAuthGuard } from './google-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Throttle({
        default: {
            ttl: 60,
            limit: 60
        }
    })
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
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 10 * 24 * 60 * 60 * 1000,  // 10 days
            path: "/",
            domain: isProd ? ".zoralabs.fun" : undefined  
        });

        return res.status(200).json({ message: result.message });
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    me(@Req() req: Request) {
        return this.authService.getUserFromCookie(req);
    }

    @Post("logout")
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            domain: isProd ? ".zoralabs.fun" : undefined  
        });
        return { success: true };
    }

    @Get("google")
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // redirection handled by passport and google strategy
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const jwt = await this.authService.login(req.user)
        res.cookie('jwt', jwt.accesstoken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : 'lax',
            path: "/",
            domain: isProd ? ".zoralabs.fun" : undefined  
        })
        
        return res.redirect(`${CLIENT_URL}/app`)
    }
}
