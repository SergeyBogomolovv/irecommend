import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { FriendRequest } from '@app/shared/entities/friend-request.entity';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User, FriendRequest])],
  providers: [FriendsResolver, FriendsService],
})
export class FriendsModule {}
