import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateRecommendationInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  link?: string;
}
