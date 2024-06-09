import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest, SharedModule } from '@app/shared';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([FriendRequest]),
    UsersModule,
  ],
  providers: [FriendsResolver, FriendsService],
})
export class FriendsModule {}
