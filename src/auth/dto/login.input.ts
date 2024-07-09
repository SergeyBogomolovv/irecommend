import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @IsEmail()
  @Field()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @Field()
  readonly password: string;
}
