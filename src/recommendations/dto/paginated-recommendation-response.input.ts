import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Recommendation } from 'src/entities/recommendation.entity';

@ObjectType()
export class PaginatedRecommendationResponse {
  constructor(payload: PaginatedRecommendationResponse) {
    Object.assign(this, payload);
  }
  @Field(() => [Recommendation])
  recommendations: Recommendation[];

  @Field(() => Int)
  pagesCount: number;
}
