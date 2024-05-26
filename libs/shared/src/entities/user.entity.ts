import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Profile } from './profile.entity';
import { FriendRequest } from './friend-request.entity';
import { Recommendation } from './recommendation.entity';
import { Comment } from './comments.entity';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToOne(() => Profile, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => Profile)
  profile: Profile;

  @ManyToMany(() => User)
  @JoinTable()
  @Field(() => [User])
  friends: User[];

  @OneToMany(() => FriendRequest, (request) => request.sender)
  @Field(() => [FriendRequest])
  sendedFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (request) => request.recipient)
  @Field(() => [FriendRequest])
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Recommendation, (recommendation) => recommendation.author)
  @Field(() => [Recommendation])
  recommendations: Recommendation[];

  @OneToMany(() => Comment, (comment) => comment.author)
  @Field(() => [Comment])
  comments: Comment[];
}
