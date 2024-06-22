import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { VerifyAccountInput } from './dto/verify.input';
import { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HashingService } from './services/hashing.service';
import { OtpMailDto } from 'src/mail/dto/otp-mail.dto';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';
import { AccessTokenResponse } from '../../libs/shared/src/dto/access.response';
import { PasswordResetInput } from './dto/password-reset.input';
import { UsersService } from 'src/users/users.service';
import { MessageResponse } from '@app/shared';
import { VerifyResponse } from '@app/shared/dto/verify.response';
import { Profile } from 'src/entities/profile.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
    private readonly hashingService: HashingService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  async login(dto: LoginInput, response: Response) {
    const user = await this.usersService.findOneByEmailOrFail(dto.email);

    const isPasswordValid = await this.hashingService.compare(
      dto.password,
      user.password,
    );

    if (!user.verified || !isPasswordValid) {
      throw new BadRequestException('Данные невереные');
    }
    const access_token = this.tokenService.generateAccessToken(user);
    const refresh_token = await this.tokenService.generateRefreshToken(user.id);
    this.logger.verbose(`${user.email} logined`);
    response.cookie('refresh_token', refresh_token.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(refresh_token.exp),
      secure: false,
      path: '/',
    });
    return new AccessTokenResponse(access_token);
  }

  async register(dto: RegisterInput) {
    const existingUser = await this.usersService.findOneByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с такой почтой уже существует');
    }
    const hashedPassword = await this.hashingService.hash(dto.password);
    const profile = new Profile();
    const newUser = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      profile: { ...profile, name: dto.name },
      profileId: profile.id,
    });
    const code = await this.otpService.generateVerifyAccountOtp(newUser.email);
    this.eventEmitter.emit(
      'send_activation_email',
      new OtpMailDto({ code, to: newUser.email }),
    );
    this.logger.verbose(`${newUser.email} registered`);
    return new VerifyResponse({
      message: `Сообщение с кодом подтверждения было отправлено на ${newUser.email}`,
      email: newUser.email,
    });
  }

  async verifyAccount(dto: VerifyAccountInput, response: Response) {
    const isCodeValid = await this.otpService.validateVerifyAccountOtp(
      dto.email,
      dto.code,
    );
    if (!isCodeValid) {
      throw new BadRequestException('Код подтверждения неверный');
    }
    const existingUser = await this.usersService.findOneByEmailOrFail(
      dto.email,
    );
    existingUser.verified = true;
    await this.usersService.update(existingUser);
    const access_token = this.tokenService.generateAccessToken(existingUser);
    const refresh_token = await this.tokenService.generateRefreshToken(
      existingUser.id,
    );
    this.logger.verbose(`${existingUser.email} verified account`);
    response.cookie('refresh_token', refresh_token.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(refresh_token.exp),
      secure: false,
      path: '/',
    });
    return new AccessTokenResponse(access_token);
  }

  async passwordResetRequest(email: string) {
    const isUserExists = await this.usersService.findOneByEmailOrFail(email);
    const code = await this.otpService.generateResetPasswordOtp(
      isUserExists.email,
    );
    this.eventEmitter.emit(
      'send_password_reset_email',
      new OtpMailDto({ to: email, code }),
    );
    this.logger.verbose(`${email} requested to change password`);
    return new VerifyResponse({
      message: 'Письмо с кодом потдверждения было отправлено вам на почту',
      email: email,
    });
  }

  async passwordReset(dto: PasswordResetInput) {
    const isCodeValid = await this.otpService.validateResetPasswordOtp(
      dto.email,
      dto.code,
    );
    if (!isCodeValid) throw new BadRequestException('Код неверный');
    const user = await this.usersService.findOneByEmailOrFail(dto.email);
    const hashedPassword = await this.hashingService.hash(dto.newPassword);
    user.password = hashedPassword;
    this.logger.verbose(`${user.email} changed password`);
    await this.usersService.update(user);
    return new MessageResponse('Пароль успешно изменен');
  }

  async refresh(refreshToken: string) {
    const token = await this.tokenService.getRefreshToken(refreshToken);
    if (!token) throw new UnauthorizedException('Token expired');
    const user = await this.usersService.findOneByIdOrFail(token.userId);
    this.logger.verbose(`${user.email} refreshed access token`);
    const access_token = this.tokenService.generateAccessToken(user);
    return new AccessTokenResponse(access_token);
  }

  async logout(response: Response, refreshToken: string) {
    await this.tokenService.deleteRefreshToken(refreshToken);
    this.logger.verbose(`User logout`);
    response.clearCookie('refresh_token');
    return new MessageResponse('Вы успешно вышли из аккаунта');
  }
}
