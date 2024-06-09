import { User } from '@app/shared';

export class DeleteFriendDto {
  constructor(payload: DeleteFriendDto) {
    Object.assign(this, payload);
  }
  user: User;
  friendId: string;
}
