import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  getFullUserInfo(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      relations: [
        'friends',
        'friends.profile',
        'favorites',
        'profile.logo',
        'profile.contacts',
        'recommendations.comments',
        'recommendations.images',
        'sendedFriendRequests',
        'receivedFriendRequests',
      ],
    });
  }

  async updateProfile(id: string, payload: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { profile: { logo: true } },
    });
    user.profile = { ...user.profile, ...payload };
    return await this.usersRepository.save(user);
  }
}
