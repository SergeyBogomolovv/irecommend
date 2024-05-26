import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ title: 'Имя', example: 'Иван' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ title: 'Почта', example: 'example@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ title: 'Пароль', example: '123456' })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
