import {
  Column,
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

  @ManyToOne(() => User, (user) => user.sendedFriendRequests, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  sender: User;

  @Column()
  @Field()
  senderId: string;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  recipient: User;

  @Column()
  @Field()
  recipientId: string;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
