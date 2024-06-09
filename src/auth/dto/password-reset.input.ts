import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsString, MinLength } from 'class-validator';

@InputType()
export class PasswordResetInput {
  @ApiProperty({ title: 'Почта', example: 'example@gmail.com' })
  @IsEmail()
  @Field()
  readonly email: string;

  @ApiProperty({ title: 'Код подтверждения', example: '457284' })
  @IsNumberString()
  @Field()
  readonly code: string;

  @ApiProperty({ title: 'Новый пароль', example: '123456' })
  @IsString()
  @MinLength(6)
  @Field()
  readonly newPassword: string;
}
