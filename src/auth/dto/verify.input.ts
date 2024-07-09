import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNumberString, MinLength } from 'class-validator';

@InputType()
export class VerifyAccountInput {
  @IsEmail()
  @Field()
  readonly email: string;

  @IsNumberString()
  @MinLength(6)
  @Field()
  readonly code: string;
}
