import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { USER_REQUEST_KEY } from '../constants';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserFromGql = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const user = req[USER_REQUEST_KEY];
    if (key) {
      return user[key] ? user[key] : null;
    }
    return user ? user : null;
  },
);
