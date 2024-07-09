import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNumberString, IsString, MinLength } from 'class-validator';

@InputType()
export class PasswordResetInput {
  @IsEmail()
  @Field()
  readonly email: string;

  @IsNumberString()
  @Field()
  readonly code: string;

  @IsString()
  @MinLength(6)
  @Field()
  readonly newPassword: string;
}
