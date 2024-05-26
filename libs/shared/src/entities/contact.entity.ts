import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Profile } from './profile.entity';

enum Contacts {
  telegram = 'telegram',
  instagram = 'instagram',
  discord = 'discord',
  vk = 'vk',
}

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
  @Field(() => [Contacts])
  type: Contacts;

  @ManyToOne(() => Profile, (profile) => profile.contacts)
  profile: Profile;
}
