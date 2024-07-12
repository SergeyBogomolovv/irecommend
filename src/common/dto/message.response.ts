import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageResponse {
  constructor(message: string) {
    this.message = message;
  }

  @Field()
  readonly message: string;
}
