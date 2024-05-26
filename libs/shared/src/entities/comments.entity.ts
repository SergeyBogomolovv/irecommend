import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Recommendation } from './recommendation.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @Column()
  @Field()
  readonly content: string;

  @ManyToOne(() => Recommendation, (recommendation) => recommendation.comments)
  @Field(() => Recommendation)
  readonly recommendation: Recommendation;

  @ManyToOne(() => User, (user) => user.comments)
  @Field(() => User)
  readonly author: User;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
