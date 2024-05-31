import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Profile } from './profile.entity';

export enum Contacts {
  TELEGRAM = 'TELEGRAM',
  INSTAGRAM = 'INSTAGRAM',
  DISCORD = 'DISCORD',
  VK = 'VK',
}

registerEnumType(Contacts, {
  name: 'Contacts',
});

@ObjectType()
@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  url: string;

  @Column({ type: 'enum', enum: Contacts })
  @Field(() => Contacts)
  type: Contacts;

  @ManyToOne(() => Profile, (profile) => profile.contacts)
  @Field(() => Profile, { nullable: true })
  profile: Profile;
}
