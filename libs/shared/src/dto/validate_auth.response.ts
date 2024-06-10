import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ValidateAuthResponse {
  constructor(authenticated: boolean) {
    this.authenticated = authenticated;
  }

  @Field(() => Boolean)
  readonly authenticated: boolean;
}
