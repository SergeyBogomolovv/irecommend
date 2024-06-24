import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecommendationsService } from './recommendations.service';
import { MessageResponse } from '@app/shared/dto/message.response';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { UseGuards } from '@nestjs/common';
import { CreateRecommendationInput } from './dto/create-recommendation.input';
import { UpdateRecommendationInput } from './dto/update-recommendation.input';
import { GqlAuthGuard, GqlRelations, UserFromGql } from '@app/shared';
import {
  Recommendation,
  RecommendationType,
} from 'src/entities/recommendation.entity';
import { PaginatedRecommendationResponse } from './dto/paginated-recommendation-response.input';

@Resolver()
export class RecommendationsResolver {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Query(() => [Recommendation], { name: 'search_recommendations' })
  findManyByName(
    @Args('query') query: string,
    @GqlRelations('search_recommendations') relations: string[],
  ) {
    return this.recommendationsService.searchRecommendations(query, relations);
  }

  @Query(() => PaginatedRecommendationResponse, {
    name: 'last_recommendations',
  })
  getMany(
    @Args('type', { type: () => RecommendationType, nullable: true })
    type: RecommendationType,
    @Args('page', { type: () => Int, nullable: true }) page: number,
    @GqlRelations('last_recommendations.recommendations') relations: string[],
  ) {
    return this.recommendationsService.getLast(type, relations, page);
  }

  @Query(() => Recommendation, { name: 'get_recommendation_by_id' })
  findOneById(
    @Args('id') id: string,
    @GqlRelations('get_recommendation_by_id') relations: string[],
  ) {
    return this.recommendationsService.findOneByIdOrFail(id, relations);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'create_recommendation' })
  async createRecommendation(
    @UserFromGql('id') authorId: string,
    @Args('payload', { type: () => CreateRecommendationInput })
    payload: CreateRecommendationInput,
    @Args('images', { type: () => [GraphQLUpload], nullable: true })
    images: Array<Promise<FileUpload>> | null,
  ) {
    return this.recommendationsService.create(authorId, payload, images);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'update_recommendation' })
  async updateRecommendation(
    @UserFromGql('id') authorId: string,
    @Args('id') id: string,
    @Args('payload', { type: () => UpdateRecommendationInput })
    payload: UpdateRecommendationInput,
  ) {
    return this.recommendationsService.updateText(id, authorId, payload);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'delete_image_from_recommendation' })
  async deleteRecommendationImage(
    @UserFromGql('id') authorId: string,
    @Args('imageId') imageId: string,
  ) {
    return this.recommendationsService.deleteImage(imageId, authorId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'add_images_to_recommendation' })
  async addRecommendationImages(
    @UserFromGql('id') authorId: string,
    @Args('id') id: string,
    @Args('images', { type: () => [GraphQLUpload] })
    images: Array<Promise<FileUpload>>,
  ) {
    return this.recommendationsService.addImages(id, authorId, images);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'delete_recommendation' })
  async deleteRecommendation(
    @UserFromGql('id') authorId: string,
    @Args('id') id: string,
  ) {
    return this.recommendationsService.deleteRecommendation(id, authorId);
  }
}
