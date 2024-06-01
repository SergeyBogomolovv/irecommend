import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
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
  content: string;

  @ManyToOne(() => Recommendation, (recommendation) => recommendation.comments)
  @HideField()
  recommendation: Recommendation;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User, { nullable: true })
  author: User;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
