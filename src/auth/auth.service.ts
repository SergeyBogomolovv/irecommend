import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyAccountDto } from './dto/verify.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  login(dto: LoginDto, response: Response) {
    return 'This action adds a new auth';
  }

  register(dto: RegisterDto) {
    return `This action returns all auth`;
  }

  verifyAccount(dto: VerifyAccountDto, response: Response) {
    return `This action returns a # auth`;
  }

  passwordResetRequest(dto: PasswordResetRequestDto) {
    return ``;
  }

  passwordReset(dto: PasswordResetRequestDto) {
    return ``;
  }

  refresh(request: Request) {
    return ``;
  }

  logout(response: Response) {
    return `This action removes a # auth`;
  }
}
