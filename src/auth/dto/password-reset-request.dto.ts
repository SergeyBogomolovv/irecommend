import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PasswordResetRequestDto {
  @ApiProperty({ title: 'Почта', example: 'example@gmail.com' })
  @IsEmail()
  readonly email: string;
}
