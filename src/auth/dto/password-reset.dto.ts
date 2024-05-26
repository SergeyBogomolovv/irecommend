import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsString, MinLength } from 'class-validator';

export class PasswordResetDto {
  @ApiProperty({ title: 'Почта', example: 'example@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ title: 'Код подтверждения', example: '457284' })
  @IsNumberString()
  readonly code: number;

  @ApiProperty({ title: 'Новый пароль', example: '123456' })
  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}
