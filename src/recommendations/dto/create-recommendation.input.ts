import { RecommendationType } from '@app/shared/entities/recommendation.entity';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateRecommendationInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description: string;

  @IsNotEmpty()
  @IsEnum(RecommendationType)
  @Field(() => RecommendationType)
  type: RecommendationType;

  @Field({ nullable: true })
  link?: string;
}
