import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/SignIn.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly db: DatabaseService){}

    async signIn(user: SignInDto)  {
     const {email, password} = user // extract

     // hash the password here
     /*
     Steps for authentication
     1) input validation of user -> done by dtos
     2) check if the user exists in db -> 
                    if yes 
                        if username == userdb.username
                          if yes 
                             hash the user password
                            if hashedpassword == userdb.hashedpass yes -> store user in db and generate jwt and store that jwt in cookies
                    else -> store user in db and generate jwt and than store that jwt in cookies
      */

    // hash a password
    const saltRounds = 10;

     // check if user exist in database
     const findByEmail = await this.db.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
     )

      const password_hash = bcrypt.hash(password, saltRounds)
     if(findByEmail && password_hash) {
      // generate jwt as user already exist in db
      await this.db.query(
        `INSERT INTO users (id, email, password_hash)
         VALUES (gen_random_uuid(), $1, $2)
        `, [email, password_hash]
      )
     } else {
        // store user in db and than generate jwt

     }

    }
}
