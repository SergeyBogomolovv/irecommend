import { RESET_PASSWORD_KEY, VERIFY_ACCOUNT_KEY } from 'src/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async generateVerifyAccountOtp(email: string) {
    const code = this.generateCode(6);
    await this.cache.set(
      `${VERIFY_ACCOUNT_KEY}:${email}`,
      code,
      1000 * 60 * 60,
    );
    return code;
  }

  async validateVerifyAccountOtp(email: string, code: string) {
    const cachedCode = await this.cache.get(`${VERIFY_ACCOUNT_KEY}:${email}`);
    if (!cachedCode) return false;
    if (cachedCode === code) {
      await this.cache.del(`${VERIFY_ACCOUNT_KEY}:${email}`);
      return true;
    } else {
      return false;
    }
  }

  async generateResetPasswordOtp(email: string) {
    const code = this.generateCode(6);
    await this.cache.set(`${RESET_PASSWORD_KEY}:${email}`, code, 1000 * 60 * 5);
    return code;
  }

  async validateResetPasswordOtp(email: string, code: string) {
    const cachedCode = await this.cache.get(`${RESET_PASSWORD_KEY}:${email}`);
    if (!cachedCode) return false;
    if (cachedCode === code) {
      await this.cache.del(`${RESET_PASSWORD_KEY}:${email}`);
      return true;
    } else {
      return false;
    }
  }

  private generateCode(length: number): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }
}
