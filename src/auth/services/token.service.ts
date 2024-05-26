import { RefreshToken } from '@app/shared/types/refreshToken';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { User } from '@app/shared/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserJwtPayload } from '@app/shared/types/user.payload';

@Injectable()
export class TokenService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly jwtService: JwtService,
  ) {}

  async generateRefreshToken(userId: string) {
    const refreshToken = new RefreshToken({
      token: v4(),
      exp: add(new Date(), { months: 2 }),
      userId,
    });
    await this.cache.set(
      `refreshToken:${refreshToken.token}`,
      refreshToken,
      1000 * 3600 * 24 * 60,
    );
    return refreshToken;
  }

  async getRefreshToken(token: string) {
    const existingToken = await this.cache.get<RefreshToken>(
      `refreshToken:${token}`,
    );
    if (!existingToken) {
      return null;
    }
    if (new Date(existingToken.exp) < new Date()) {
      await this.deleteRefreshToken(token);
      return null;
    }
    return existingToken;
  }

  async deleteRefreshToken(token: string) {
    await this.cache.del(`refreshToken:${token}`);
  }

  generateAccessToken(user: User) {
    const payload = new UserJwtPayload({
      id: user.id,
      email: user.email,
    });
    return this.jwtService.sign({ ...payload });
  }
}
