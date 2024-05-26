import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { Image } from './image.entity';
import { Comment } from './comments.entity';

export enum RecommendationType {
  movie = 'movie',
  music = 'music',
  anime = 'anime',
  book = 'book',
  hobby = 'hobby',
  todo = 'todo',
  series = 'series',
}

@ObjectType()
@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @Column()
  @Field()
  readonly description: string;

  @Column({ type: 'enum', enum: RecommendationType })
  @Field(() => RecommendationType)
  readonly type: RecommendationType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  readonly link?: string;

  @OneToMany(() => Image, (image) => image.recommendation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Image])
  readonly images: Image[];

  @OneToMany(() => Comment, (comment) => comment.recommendation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Comment])
  readonly comments: Comment[];

  @ManyToOne(() => User, (author) => author.recommendations)
  @Field(() => User)
  readonly author: User;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
