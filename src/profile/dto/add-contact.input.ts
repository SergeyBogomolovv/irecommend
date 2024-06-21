import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Contacts } from 'src/entities/contact.entity';

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
