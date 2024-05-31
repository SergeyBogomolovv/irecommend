import { MessageResponse } from '@app/shared/dto/message.response';
import { FriendRequest } from '@app/shared/entities/friend-request.entity';
import { User } from '@app/shared/entities/user.entity';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddFriendDto } from './dto/add-friend.dto';
import { DeleteFriendDto } from './dto/delete-friend.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestsRepository: Repository<FriendRequest>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async sendFriendRequest(id: string, friendId: string) {
    if (id === friendId)
      throw new ConflictException('Нельзя добавить в друзья самого себя');
    const user = await this.usersRepository.findOne({ where: { id } });
    const friend = await this.usersRepository.findOneOrFail({
      where: { id: friendId },
    });
    await this.friendRequestsRepository.save(
      this.friendRequestsRepository.create({
        sender: user,
        recipient: friend,
      }),
    );
    return new MessageResponse(`Заявка в друзья отправлена`);
  }

  async declineFriendRequest(id: string) {
    await this.friendRequestsRepository.delete(id);
    return new MessageResponse('Заявка в друзья отклонена');
  }

  async deleteUserFromFriends(id: string, friendId: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { friends: { friends: true } },
    });
    const friend = await this.usersRepository.findOneOrFail({
      where: { id: friendId },
      relations: { friends: { friends: true } },
    });
    this.eventEmitter.emit(
      'delete_friend',
      new DeleteFriendDto({ user, friendId: friend.id }),
    );
    this.eventEmitter.emit(
      'delete_friend',
      new DeleteFriendDto({ user: friend, friendId: user.id }),
    );
    return new MessageResponse('Пользователь удален из друзей');
  }

  async acceptFriendRequest(userId: string, requestId: string) {
    const request = await this.friendRequestsRepository.findOneOrFail({
      where: { id: requestId },
      relations: { sender: { friends: true }, recipient: { friends: true } },
    });
    if (request.recipient.id !== userId)
      throw new UnauthorizedException(
        'Заявку в друзья может принять только получатель',
      );
    this.eventEmitter.emit(
      'add_friend',
      new AddFriendDto({ user: request.recipient, friend: request.sender }),
    );
    this.eventEmitter.emit(
      'add_friend',
      new AddFriendDto({ user: request.sender, friend: request.recipient }),
    );
    await this.friendRequestsRepository.delete(request.id);
    return new MessageResponse('Заявка в друзья принята');
  }

  @OnEvent('add_friend')
  async addFriend(payload: AddFriendDto) {
    payload.user.friends.push(payload.friend);
    await this.usersRepository.save(payload.user);
  }

  @OnEvent('delete_friend')
  async deleteFriend(payload: DeleteFriendDto) {
    payload.user.friends = payload.user.friends.filter(
      (friend) => friend.id !== payload.friendId,
    );
    await this.usersRepository.save(payload.user);
  }
}
