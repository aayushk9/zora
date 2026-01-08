import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/SignIn.dto';

@Injectable()
export class AuthService {
    constructor(){}

    async signIn(user: SignInDto)  {
     const {userName, password} = user // extract

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
    }
}
