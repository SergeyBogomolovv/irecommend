import { Contacts } from '@app/shared';
import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddContactDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  url: string;

  @IsEnum(Contacts)
  @Field(() => Contacts)
  type: Contacts;
}
