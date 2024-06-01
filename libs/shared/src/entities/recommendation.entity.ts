import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from './user.entity';
import { Image } from './image.entity';
import { Comment } from './comments.entity';

export enum RecommendationType {
  MOVIE = 'MOVIE',
  MUSIC = 'MUSIC',
  ANIME = 'ANIME',
  BOOK = 'BOOK',
  HOBBY = 'HOBBY',
  TODO = 'TODO',
  SERIES = 'SERIES',
}

registerEnumType(RecommendationType, {
  name: 'RecommendationType',
});

@ObjectType()
@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @Column()
  @Field()
  description: string;

  @Column({ type: 'enum', enum: RecommendationType })
  @Field(() => RecommendationType)
  type: RecommendationType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  link?: string;

  @OneToMany(() => Image, (image) => image.recommendation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Image], { nullable: true })
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.recommendation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @ManyToOne(() => User, (author) => author.recommendations)
  @Field(() => User, { nullable: true })
  author: User;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
