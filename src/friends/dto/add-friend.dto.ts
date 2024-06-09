import { User } from '@app/shared';

export class AddFriendDto {
  constructor(payload: AddFriendDto) {
    Object.assign(this, payload);
  }
  user: User;
  friend: User;
}
