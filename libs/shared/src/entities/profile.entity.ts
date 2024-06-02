import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Contact } from './contact.entity';

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

  @Column({ nullable: true })
  @Field({ nullable: true })
  logo?: string;

  @OneToMany(() => Contact, (contacts) => contacts.profile, { cascade: true })
  @Field(() => [Contact], { nullable: true })
  contacts: Contact[];
}
