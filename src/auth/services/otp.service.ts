import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async generateVerifyAccountOtp(email: string) {
    const code = this.generateCode(6);
    await this.cache.set(`verify-account-otp:${email}`, code, 1000 * 60 * 60);
    return code;
  }

  async validateVerifyAccountOtp(email: string, code: string) {
    const cachedCode = await this.cache.get(`verify-account-otp:${email}`);
    if (!cachedCode) return false;
    if (cachedCode === code) {
      await this.cache.del(`verify-account-otp:${email}`);
      return true;
    } else {
      return false;
    }
  }

  async generateResetPasswordOtp(email: string) {
    const code = this.generateCode(6);
    await this.cache.set(`reset-password-otp:${email}`, code, 1000 * 60 * 5);
    return code;
  }

  async validateResetPasswordOtp(email: string, code: string) {
    const cachedCode = await this.cache.get(`reset-password-otp:${email}`);
    if (!cachedCode) return false;
    if (cachedCode === code) {
      await this.cache.del(`reset-password-otp:${email}`);
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
