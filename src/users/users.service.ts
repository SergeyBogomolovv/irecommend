import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async findOneByIdOrFail(id: string, relations?: string[]) {
    this.logger.verbose(`Founding for user by ${id}`);
    const user = await this.usersRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async findOneByEmailOrFail(email: string, relations?: string[]) {
    this.logger.verbose(`Founding for user by ${email}`);
    const user = await this.usersRepository.findOne({
      where: { email },
      relations,
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async findOneById(id: string, relations?: string[]) {
    this.logger.verbose(`Founding for user by ${id}`);
    return await this.usersRepository.findOne({
      where: { id },
      relations,
    });
  }

  async findOneByEmail(email: string, relations?: string[]) {
    this.logger.verbose(`Founding for user by ${email}`);
    return await this.usersRepository.findOne({
      where: { email },
      relations,
    });
  }

  async create(user: Partial<User>) {
    return await this.usersRepository.save(this.usersRepository.create(user));
  }

  async update(user: Partial<User>) {
    return await this.usersRepository.save(user);
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
