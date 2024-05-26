import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, MinLength } from 'class-validator';

export class VerifyAccountDto {
  @ApiProperty({ title: 'Почта пользователя', example: 'example@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ title: 'otp код', example: '456714' })
  @IsNumberString()
  @MinLength(6)
  readonly code: number;
}
