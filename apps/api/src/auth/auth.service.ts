import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService
  ) { }

  async signIn(email: string, password: string) {
    const result = await this.db.query(
      `SELECT id, email, password_hash 
          FROM users 
          WHERE email = $1
         `, [email]
    )

    console.log(result)

    if (result.rowCount == 0) {
      const password_hash = await bcrypt.hash(password, 10)
      await this.db.query(
        `INSERT INTO users (id, email, password_hash)
             VALUES (gen_random_uuid(), $1, $2)
            `, [email, password_hash]
      )
      const payload = {email};
      const jwt = this.jwt.sign(payload)
      return {
        message: "Login successful",
        token: jwt
      }
    }

    const user = result.rows[0]
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return { message: "Invalid credentials" }
    }

    const payload = {email};
    const jwt = this.jwt.sign(payload)
    return {
      message: "Login successful",
      token: jwt
    }
  }

   getUserFromCookie(req: Request) {
    const token = req.cookies?.jwt;
    if (!token) return null;

    return this.jwt.verify(token);
  }
}
