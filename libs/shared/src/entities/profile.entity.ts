import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Contact } from './contact.entity';
import { Logo } from './logo.entity';

@ObjectType()
@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @Column({ unique: true })
  @Field()
  readonly name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  readonly about?: string;

  @OneToOne(() => Logo, { nullable: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => Logo, { nullable: true })
  readonly logo?: string;

  @OneToMany(() => Contact, (contacts) => contacts.profile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Contact])
  readonly contacts: Contact[];
}
