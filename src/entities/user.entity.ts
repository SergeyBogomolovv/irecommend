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
import { Recommendation } from './recommendation.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;

  @Expose({ groups: ['private'] })
  @Column({ unique: true })
  @Field({ nullable: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @Field({ nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  verified: boolean;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  @Field(() => Profile)
  profile: Profile;

  @Column()
  @Field()
  profileId: string;

  @OneToMany(() => Recommendation, (recommendation) => recommendation.author)
  @Field(() => [Recommendation])
  recommendations: Recommendation[];

  @ManyToMany(
    () => Recommendation,
    (recommendation) => recommendation.favoritedBy,
  )
  @JoinTable()
  @Field(() => [Recommendation])
  favorites: Recommendation[];
}
