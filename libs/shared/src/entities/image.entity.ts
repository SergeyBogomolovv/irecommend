import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
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
  @Field(() => Recommendation, { nullable: true })
  recommendation: Recommendation;
}
