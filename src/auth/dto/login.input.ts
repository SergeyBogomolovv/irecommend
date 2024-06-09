import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @ApiProperty({ title: 'Почта', example: 'example@gmail.com' })
  @IsEmail()
  @Field()
  readonly email: string;

  @ApiProperty({ title: 'Пароль', example: '123456' })
  @IsString()
  @MinLength(6)
  @Field()
  readonly password: string;
}
