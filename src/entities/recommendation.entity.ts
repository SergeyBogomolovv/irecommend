import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
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
  title: string;

  @Column()
  @Field()
  description: string;

  @ManyToMany(() => User, (user) => user.favorites)
  @Field(() => [User])
  favoritedBy: User[];

  @Column('int', { default: 0 })
  @Field(() => Int)
  favoritesCount: number;

  @Column({ type: 'enum', enum: RecommendationType })
  @Field(() => RecommendationType)
  type: RecommendationType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  link?: string;

  @OneToMany(() => Image, (image) => image.recommendation, { cascade: true })
  @Field(() => [Image])
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.recommendation, {
    cascade: true,
  })
  @Field(() => [Comment])
  comments: Comment[];

  @ManyToOne(() => User, (author) => author.recommendations, {
    onDelete: 'SET NULL',
  })
  @Field(() => User)
  author: User;

  @Column()
  authorId: string;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
