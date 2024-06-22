import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FriendsService } from './friends.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, MessageResponse, UserFromGql } from '@app/shared';
import { FriendRequest } from 'src/entities/friend-request.entity';

@Resolver()
export class FriendsResolver {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => FriendRequest, { name: 'send_friend_request' })
  sendFriendRequest(
    @UserFromGql('id') id: string,
    @Args('friendId') friendId: string,
  ) {
    return this.friendsService.sendFriendRequest(id, friendId);
  }

  @Mutation(() => MessageResponse, { name: 'decline_friend_request' })
  declineFriendRequest(@Args('requestId') requestId: string) {
    return this.friendsService.declineFriendRequest(requestId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'accept_friend_request' })
  acceptFriendRequest(
    @UserFromGql('id') userId: string,
    @Args('requestId') requestId: string,
  ) {
    return this.friendsService.acceptFriendRequest(userId, requestId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'delete_friend' })
  deleteFriend(
    @UserFromGql('id') userId: string,
    @Args('friendId') friendId: string,
  ) {
    return this.friendsService.deleteUserFromFriends(userId, friendId);
  }
}
