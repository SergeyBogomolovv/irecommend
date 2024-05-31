import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { PublicUserResponse } from '@app/shared/dto/public-user.response';
import { FuseResult } from 'fuse.js';
const Fuse = require('fuse.js');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(id: string, relations: string[]) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations,
    });
    return new PublicUserResponse(user);
  }

  async searchUsers(name: string, relations: string[]) {
    const list = await this.usersRepository.find({
      where: { verified: true },
      relations: [...relations, 'profile'],
    });

    const fuseOptions = {
      isCaseSensitive: false,
      includeMatches: true,
      findAllMatches: true,
      threshold: 0.4,
      keys: ['profile.name'],
    };

    const fuse = new Fuse(list, fuseOptions);
    return fuse
      .search(name)
      .map((result: FuseResult<User>) => new PublicUserResponse(result.item));
  }
}
