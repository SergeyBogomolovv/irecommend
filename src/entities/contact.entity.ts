import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  Field,
  HideField,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Profile } from './profile.entity';

export enum Contacts {
  TELEGRAM = 'TELEGRAM',
  INSTAGRAM = 'INSTAGRAM',
  DISCORD = 'DISCORD',
  VK = 'VK',
}

export const contactsUrl = {
  [Contacts.TELEGRAM]: 'https://t.me/',
  [Contacts.INSTAGRAM]: 'https://www.instagram.com/',
  [Contacts.VK]: 'https://vk.com/',
};

registerEnumType(Contacts, {
  name: 'Contacts',
});

@ObjectType()
@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  url: string;

  @Column()
  @Field()
  nickname: string;

  @Column({ type: 'enum', enum: Contacts })
  @Field(() => Contacts)
  type: Contacts;

  @ManyToOne(() => Profile, (profile) => profile.contacts, {
    onDelete: 'CASCADE',
  })
  @HideField()
  profile: Profile;
}
