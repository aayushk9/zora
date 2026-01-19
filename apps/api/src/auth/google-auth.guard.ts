import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends (AuthGuard('google') as new () => any) {
  protected getAuthenticateOptions(
    context: ExecutionContext,
  ): IAuthModuleOptions {
    return {
      prompt: 'select_account',
    };
  }
}