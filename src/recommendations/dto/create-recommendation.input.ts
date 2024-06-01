import {
  Recommendation,
  RecommendationType,
} from '@app/shared/entities/recommendation.entity';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateRecommendationInput implements Partial<Recommendation> {
  @IsNotEmpty()
  @IsString()
  @Field()
  description: string;

  @IsNotEmpty()
  @IsEnum(RecommendationType)
  @Field(() => RecommendationType)
  type: RecommendationType;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  link?: string;
}
