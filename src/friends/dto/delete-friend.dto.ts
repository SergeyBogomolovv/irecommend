import { User } from '@app/shared/entities/user.entity';

export class DeleteFriendDto {
  constructor(payload: DeleteFriendDto) {
    Object.assign(this, payload);
  }
  user: User;
  friendId: string;
}
