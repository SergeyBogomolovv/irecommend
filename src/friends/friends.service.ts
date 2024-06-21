import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { MessageResponse } from '@app/shared';
import { FriendRequest } from 'src/entities/friend-request.entity';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(FriendRequest)
    private readonly friendRequestsRepository: Repository<FriendRequest>,
  ) {}

  async sendFriendRequest(id: string, friendId: string) {
    if (id === friendId)
      throw new ConflictException('Нельзя добавить в друзья самого себя');
    const [user, friend] = await Promise.all([
      this.usersService.findOneByIdOrFail(id),
      this.usersService.findOneByIdOrFail(friendId),
    ]);
    const friendRequest = this.friendRequestsRepository.create({
      sender: user,
      senderId: user.id,
      recipient: friend,
      recipientId: friend.id,
    });
    this.logger.verbose(`${user.email} sent friend request to ${friend.email}`);
    return await this.friendRequestsRepository.save(friendRequest);
  }

  async declineFriendRequest(id: string) {
    await this.friendRequestsRepository.delete(id);
    this.logger.verbose(`Friend request with id ${id} rejected`);
    return new MessageResponse('Заявка в друзья отклонена');
  }

  async deleteUserFromFriends(id: string, friendId: string) {
    const user = await this.usersService.findOneByIdOrFail(id, ['friends']);
    const friend = await this.usersService.findOneByIdOrFail(friendId, [
      'friends',
    ]);
    user.friends = user.friends.filter((friend) => friend.id !== friendId);
    friend.friends = friend.friends.filter((friend) => friend.id !== user.id);
    await Promise.all([
      this.usersService.update(user),
      this.usersService.update(friend),
    ]);
    this.logger.verbose(`${user.email} deleted ${friend.email} from friends`);
    return new MessageResponse('Пользователь удален из друзей');
  }

  async acceptFriendRequest(userId: string, requestId: string) {
    const request = await this.friendRequestsRepository.findOneOrFail({
      where: { id: requestId },
      relations: { sender: { friends: true }, recipient: { friends: true } },
    });
    if (request.recipientId !== userId)
      throw new UnauthorizedException(
        'Заявку в друзья может принять только получатель',
      );

    request.recipient.friends.push(request.sender);
    request.sender.friends.push(request.recipient);

    await Promise.all([
      this.usersService.update(request.sender),
      this.usersService.update(request.recipient),
    ]);

    this.logger.verbose(
      `${request.recipient.email} accepted friend request from ${request.sender.email}`,
    );
    await this.friendRequestsRepository.delete(request.id);
    return new MessageResponse('Заявка в друзья принята');
  }
}
