import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VerifyResponse {
  constructor(payload: VerifyResponse) {
    Object.assign(this, payload);
  }

  @Field()
  readonly message: string;

  @Field()
  readonly email: string;
}
