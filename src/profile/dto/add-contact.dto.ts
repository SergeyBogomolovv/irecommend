import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddContactDto {
  @Field()
  url: string;
  @Field()
  type: string;
}
