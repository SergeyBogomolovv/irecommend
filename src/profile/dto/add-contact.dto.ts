import { Contacts } from '@app/shared/entities/contact.entity';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddContactDto {
  @Field()
  url: string;
  @Field(() => Contacts)
  type: Contacts;
}
