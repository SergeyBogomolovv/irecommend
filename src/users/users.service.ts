import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { FuseResult } from 'fuse.js';
const Fuse = require('fuse.js');

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(id: string, relations: string[]) {
    this.logger.verbose(`Founding for user by ${id}`);
    return await this.usersRepository.findOneOrFail({
      where: { id },
      relations,
    });
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
    this.logger.verbose(`Searching for users by ${name}`);
    return fuse.search(name).map((result: FuseResult<User>) => result.item);
  }
}
