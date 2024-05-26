import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ title: 'Почта', example: 'example@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ title: 'Пароль', example: '123456' })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
