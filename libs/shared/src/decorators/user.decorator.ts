import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import USER_REQUEST_KEY from '../constants/user-request-key';

export const UserFromReq = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request[USER_REQUEST_KEY];
    if (key) {
      return user[key] ? user[key] : null;
    }
    return user ? user : null;
  },
);
