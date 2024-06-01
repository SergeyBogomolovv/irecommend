import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Recommendation } from './recommendation.entity';

@ObjectType()
@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  url: string;

  @ManyToOne(() => Recommendation, (recommendation) => recommendation.images)
  @HideField()
  recommendation: Recommendation;
}
