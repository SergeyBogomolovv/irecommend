import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @ManyToOne(() => User, (user) => user.sendedFriendRequests)
  @Field(() => User)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  @Field(() => User)
  recipient: User;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
