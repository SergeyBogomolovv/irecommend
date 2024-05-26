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

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  about?: string;

  @OneToOne(() => Logo, { nullable: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => Logo, { nullable: true })
  logo?: string;

  @OneToMany(() => Contact, (contacts) => contacts.profile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Contact])
  readonly contacts: Contact[];
}
