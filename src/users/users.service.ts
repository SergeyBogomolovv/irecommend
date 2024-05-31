import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { PublicUserResponse } from '@app/shared/dto/public-user.response';

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
}
