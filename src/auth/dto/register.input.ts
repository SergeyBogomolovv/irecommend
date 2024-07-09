import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  readonly name: string;

  @IsEmail()
  @Field()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @Field()
  readonly password: string;
}
