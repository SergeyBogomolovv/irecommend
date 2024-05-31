import { ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { Exclude } from 'class-transformer';

@ObjectType()
export class PublicUserResponse extends User {
  constructor(user: User) {
    super();
    Object.assign(this, user);
  }

  @Exclude()
  password: string;

  @Exclude()
  email: string;
}
