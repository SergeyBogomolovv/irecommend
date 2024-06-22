import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { FuseResult } from 'fuse.js';
import { MessageResponse } from '@app/shared/dto/message.response';
const Fuse = require('fuse.js');

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findOneByIdOrFail(id: string, relations?: string[]) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    this.logger.verbose(`User ${user.email} found by id`);
    return user;
  }

  async findOneByEmailOrFail(email: string, relations?: string[]) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations,
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    this.logger.verbose(`User ${user.email} found by email`);
    return user;
  }

  async findOneById(id: string, relations?: string[]) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations,
    });
    if (user) this.logger.verbose(`User ${user.email} found by id`);
    return user;
  }

  async findOneByEmail(email: string, relations?: string[]) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations,
    });
    if (user) this.logger.verbose(`User ${user.email} found by email`);
    return user;
  }

  async create(user: Partial<User>) {
    this.logger.verbose(`Creating user with`, JSON.stringify(user));
    return await this.usersRepository.save(this.usersRepository.create(user));
  }

  async update(user: Partial<User>) {
    this.logger.verbose(`Updating user with`, JSON.stringify(user));
    return await this.usersRepository.save(user);
  }

  async searchUsers(name: string, relations: string[], page = 1, limit = 100) {
    const list = await this.usersRepository.find({
      where: { verified: true },
      relations: [...relations, 'profile'],
      skip: page * limit - limit,
      take: limit,
    });

    const fuseOptions = {
      isCaseSensitive: false,
      includeMatches: true,
      findAllMatches: true,
      threshold: 0.4,
      keys: ['profile.name'],
    };

    const fuse = new Fuse(list, fuseOptions);
    this.logger.verbose(`Searching for users by name:${name}`);
    return fuse.search(name).map((result: FuseResult<User>) => result.item);
  }

  async delete(id: string) {
    const user = await this.findOneByIdOrFail(id);
    await this.usersRepository.remove(user);
    this.logger.verbose(`User ${user.email} deleted account`);
    return new MessageResponse('Аккаунт удален');
  }
}
