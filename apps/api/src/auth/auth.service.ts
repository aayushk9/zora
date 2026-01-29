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

    if (result.rowCount == 0) {
      const password_hash = await bcrypt.hash(password, 10)
      const insert = await this.db.query(
        `INSERT INTO users (email, password_hash)
             VALUES ($1, $2)
             RETURNING id, email
            `, [email, password_hash]
      )
      
      const newUser = insert.rows[0]
      const payload = { email: newUser.email, sub: newUser.id };
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

    const payload = { email: user.email, sub: user.id };
    const jwt = this.jwt.sign(payload)
    return {
      message: "Login successful",
      token: jwt
    }
  }

  getUserFromCookie(req: Request) {
    const token = req.cookies?.jwt;
    if (!token) return null;
   
    try {
       return this.jwt.verify(token);
    } catch {
      return null;
    }
  }

  async login(user: any) {
    const doesUserExist = await this.db.query(
      `SELECT id, email 
      FROM users
      WHERE email = $1
      `, [user.email]
    )

    let userId: string;

    if (doesUserExist.rowCount == 0) {
      const insert = await this.db.query(
        `INSERT INTO users (email)
       VALUES ($1)
       RETURNING id, email
      `, [user.email]
      )
      userId = insert.rows[0].id
    } else {
      userId = doesUserExist.rows[0].id
    }
    const payload = { email: user.email, sub: userId }
    const token = this.jwt.sign(payload)
    return {
      accesstoken: token
    }
  }
}
