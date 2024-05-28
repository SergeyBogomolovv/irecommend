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

@Entity()
@ObjectType()
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
  @Field()
  password: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  verified: boolean;

  @OneToOne(() => Profile, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => Profile, { nullable: true })
  profile: Profile;

  @ManyToMany(() => User)
  @JoinTable()
  @Field(() => [User], { nullable: true })
  friends: User[];

  @OneToMany(() => FriendRequest, (request) => request.sender)
  @Field(() => [FriendRequest], { nullable: true })
  sendedFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (request) => request.recipient)
  @Field(() => [FriendRequest], { nullable: true })
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Recommendation, (recommendation) => recommendation.author)
  @Field(() => [Recommendation], { nullable: true })
  recommendations: Recommendation[];

  @ManyToMany(() => Recommendation)
  @JoinTable()
  @Field(() => [Recommendation], { nullable: true })
  favorites: Recommendation[];
}
