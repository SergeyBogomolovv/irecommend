import { MessageResponse } from '@app/shared/dto/message.response';
import { FriendRequest } from '@app/shared/entities/friend-request.entity';
import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddFriendDto } from './dto/add-friend.dto';
import { DeleteFriendDto } from './dto/delete-friend.dto';
import { UsersService } from 'src/users/users.service';
import { format } from 'date-fns';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(FriendRequest)
    private readonly friendRequestsRepository: Repository<FriendRequest>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async sendFriendRequest(id: string, friendId: string) {
    if (id === friendId)
      throw new ConflictException('Нельзя добавить в друзья самого себя');
    const user = await this.usersService.findOneByIdOrFail(id);
    const friend = await this.usersService.findOneByIdOrFail(friendId);
    await this.friendRequestsRepository.save(
      this.friendRequestsRepository.create({
        sender: user,
        recipient: friend,
      }),
    );
    this.logger.verbose(
      `${user.email} sent friend request to ${friend.email} at ${this.date()}`,
    );
    return new MessageResponse(`Заявка в друзья отправлена`);
  }

  async declineFriendRequest(id: string) {
    await this.friendRequestsRepository.delete(id);
    this.logger.verbose(
      `Friend request with id ${id} rejected at ${this.date()}`,
    );
    return new MessageResponse('Заявка в друзья отклонена');
  }

  async deleteUserFromFriends(id: string, friendId: string) {
    const user = await this.usersService.findOneByIdOrFail(id, [
      'friends.friends',
    ]);
    const friend = await this.usersService.findOneByIdOrFail(friendId, [
      'friends.friends',
    ]);
    this.eventEmitter.emit(
      'delete_friend',
      new DeleteFriendDto({ user, friendId: friend.id }),
    );
    this.eventEmitter.emit(
      'delete_friend',
      new DeleteFriendDto({ user: friend, friendId: user.id }),
    );
    this.logger.verbose(
      `${user.email} deleted ${friend.email} from friends at ${this.date()}`,
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
    this.logger.verbose(
      `${request.recipient.email} accepted friend request from ${request.sender.email} at ${this.date()}`,
    );
    await this.friendRequestsRepository.delete(request.id);
    return new MessageResponse('Заявка в друзья принята');
  }

  @OnEvent('add_friend')
  async addFriend(payload: AddFriendDto) {
    payload.user.friends.push(payload.friend);
    await this.usersService.update(payload.user);
  }

  @OnEvent('delete_friend')
  async deleteFriend(payload: DeleteFriendDto) {
    payload.user.friends = payload.user.friends.filter(
      (friend) => friend.id !== payload.friendId,
    );
    await this.usersService.update(payload.user);
  }

  private date() {
    return format(new Date(), 'dd.MM.yy HH:mm:ss');
  }
}
