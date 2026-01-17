import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.jwt || null;
      },
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub,
      email: payload.email 
    };
  }
}