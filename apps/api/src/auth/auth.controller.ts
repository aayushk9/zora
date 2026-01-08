import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/SignIn.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    signin(@Body() user: SignInDto) {
     return this.authService.signIn(user)
    }
}
