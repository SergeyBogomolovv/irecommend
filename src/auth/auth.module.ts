import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@app/shared/entities/user.entity';
import { Profile } from '@app/shared/entities/profile.entity';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';
import { HashingService } from './services/hashing.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    TypeOrmModule.forFeature([User, Profile]),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService, TokenService, HashingService],
})
export class AuthModule {}
