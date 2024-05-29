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

  async findOne(id: string, relations: string[]) {
    return this.usersRepository.findOne({
      where: { id },
      relations,
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
