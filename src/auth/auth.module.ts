import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';
import { HashingService } from './services/hashing.service';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule, UsersModule],
  providers: [
    AuthService,
    OtpService,
    TokenService,
    HashingService,
    AuthResolver,
  ],
})
export class AuthModule {}
