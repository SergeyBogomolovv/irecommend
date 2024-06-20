import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { Recommendation } from './recommendation.entity';

@ObjectType()
@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @Column()
  @Field()
  content: string;

  @ManyToOne(
    () => Recommendation,
    (recommendation) => recommendation.comments,
    { onDelete: 'CASCADE' },
  )
  @HideField()
  recommendation: Recommendation;

  @Column()
  @Field()
  recommendationId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User)
  author: User;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
