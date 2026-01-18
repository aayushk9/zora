import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
   JwtModule.register({
    secret: process.env.JWT_SECRET!,
    signOptions: { expiresIn: '10d'}
   }),
   PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService, GoogleStrategy, JwtStrategy]
})
export class AuthModule {}
