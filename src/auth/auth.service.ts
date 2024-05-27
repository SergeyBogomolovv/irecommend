import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyAccountDto } from './dto/verify.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HashingService } from './services/hashing.service';
import { OtpMailDto } from 'src/mail/dto/otp-mail.dto';
import { OtpService } from './services/otp.service';
import { MessageResponse } from './response/message.response';
import { TokenService } from './services/token.service';
import { AccessTokenResponse } from './response/access.response';
import { PasswordResetDto } from './dto/password-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
    private readonly hashingService: HashingService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  async login(dto: LoginDto, response: Response) {
    const user = await this.userRepository.findOneBy({ email: dto.email });

    const isPasswordValid = await this.hashingService.compare(
      dto.password,
      user.password,
    );

    if (!user || !user.verified || !isPasswordValid) {
      throw new BadRequestException('Данные невереные');
    }
    const access_token = this.tokenService.generateAccessToken(user);
    const refresh_token = await this.tokenService.generateRefreshToken(user.id);
    response.cookie('refresh_token', refresh_token.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(refresh_token.exp),
      secure: false,
      path: '/',
    });
    return response
      .status(HttpStatus.CREATED)
      .json(new AccessTokenResponse({ access_token }));
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (existingUser) {
      throw new ConflictException('Пользователь с такой почтой уже существует');
    }
    const hashedPassword = await this.hashingService.hash(dto.password);
    const newUser = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      profile: { name: dto.name },
    });
    const code = await this.otpService.generateVerifyAccountOtp(newUser.email);
    this.eventEmitter.emit(
      'send_activation_email',
      new OtpMailDto({ code, to: newUser.email }),
    );
    await this.userRepository.save(newUser);
    return new MessageResponse({
      message: `Сообщение с кодом подтверждения было отправлено на ${newUser.email}`,
    });
  }

  async verifyAccount(dto: VerifyAccountDto, response: Response) {
    const isCodeValid = await this.otpService.validateVerifyAccountOtp(
      dto.email,
      dto.code,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Код подтверждения неверный');
    }
    const existingUser = await this.userRepository.findOneBy({
      email: dto.email,
    });
    existingUser.verified = true;
    await this.userRepository.save(existingUser);
    const access_token = this.tokenService.generateAccessToken(existingUser);
    const refresh_token = await this.tokenService.generateRefreshToken(
      existingUser.id,
    );
    response.cookie('refresh_token', refresh_token.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(refresh_token.exp),
      secure: false,
      path: '/',
    });
    return response
      .status(HttpStatus.CREATED)
      .json(new AccessTokenResponse({ access_token }));
  }

  async passwordResetRequest(dto: PasswordResetRequestDto) {
    const isUserExists = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (!isUserExists) throw new BadRequestException('Аккаунт не найден');
    const code = await this.otpService.generateResetPasswordOtp(
      isUserExists.email,
    );
    this.eventEmitter.emit(
      'send_password_reset_email',
      new OtpMailDto({ to: dto.email, code }),
    );
    return new MessageResponse({
      message: 'Письмо с кодом потдверждения было отправлено вам на почту',
    });
  }

  async passwordReset(dto: PasswordResetDto) {
    const isCodeValid = await this.otpService.validateResetPasswordOtp(
      dto.email,
      dto.code,
    );
    if (!isCodeValid) throw new BadRequestException('Код неверный');
    const user = await this.userRepository.findOneBy({ email: dto.email });
    const hashedPassword = await this.hashingService.hash(dto.newPassword);
    user.password = hashedPassword;
    await this.userRepository.save(user);
    return new MessageResponse({ message: 'Пароль успешно изменен' });
  }

  async refresh(refreshToken: string) {
    const token = await this.tokenService.getRefreshToken(refreshToken);
    if (!token) throw new UnauthorizedException('Token expired');
    const user = await this.userRepository.findOneBy({ id: token.userId });
    const access_token = this.tokenService.generateAccessToken(user);
    return new AccessTokenResponse({ access_token });
  }

  async logout(response: Response, refreshToken: string) {
    await this.tokenService.deleteRefreshToken(refreshToken);
    return response
      .clearCookie('refresh_token')
      .json(new MessageResponse({ message: 'Вы успешно вышли из аккаунта' }));
  }
}
