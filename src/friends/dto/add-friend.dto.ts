import { User } from '@app/shared/entities/user.entity';

export class AddFriendDto {
  constructor(payload: AddFriendDto) {
    Object.assign(this, payload);
  }
  user: User;
  friend: User;
}
