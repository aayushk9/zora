import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
   JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '10d'}
   })
  ],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService]
})
export class AuthModule {}
