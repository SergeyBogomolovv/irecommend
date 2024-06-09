import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

@InputType()
export class PasswordResetRequestInput {
  @ApiProperty({ title: 'Почта', example: 'example@gmail.com' })
  @IsEmail()
  @Field()
  readonly email: string;
}
