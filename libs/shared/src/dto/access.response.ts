import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessTokenResponse {
  constructor(access_token: string) {
    this.access_token = access_token;
  }

  @Field()
  readonly access_token: string;
}
