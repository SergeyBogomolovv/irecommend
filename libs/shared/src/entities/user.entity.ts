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
  readonly email: string;

  @Column()
  readonly password: string;

  @Column({ type: 'boolean', default: false })
  readonly verified: boolean;

  @OneToOne(() => Profile, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => Profile)
  readonly profile: Profile;

  @ManyToMany(() => User)
  @JoinTable()
  @Field(() => [User])
  readonly friends: User[];

  @OneToMany(() => FriendRequest, (request) => request.sender)
  @Field(() => [FriendRequest])
  readonly sendedFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (request) => request.recipient)
  @Field(() => [FriendRequest])
  readonly receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Recommendation, (recommendation) => recommendation.author)
  @Field(() => [Recommendation])
  readonly recommendations: Recommendation[];

  @OneToMany(() => Comment, (comment) => comment.author)
  @Field(() => [Comment])
  readonly comments: Comment[];
}
