import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { USER_REQUEST_KEY } from '../constants';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    try {
      const token = req.headers.authorization.split(' ')[1];
      const user = this.jwtService.verify(token);
      if (!user) throw new UnauthorizedException();
      req[USER_REQUEST_KEY] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
