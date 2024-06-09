import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, MinLength } from 'class-validator';

@InputType()
export class VerifyAccountInput {
  @ApiProperty({ title: 'Почта пользователя', example: 'example@gmail.com' })
  @IsEmail()
  @Field()
  readonly email: string;

  @ApiProperty({ title: 'otp код', example: '456714' })
  @IsNumberString()
  @MinLength(6)
  @Field()
  readonly code: string;
}
