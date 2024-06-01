import { Resolver } from '@nestjs/graphql';
import { RecommendationsService } from './recommendations.service';

@Resolver()
export class RecommendationsResolver {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}
}
