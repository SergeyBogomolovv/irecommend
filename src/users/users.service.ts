import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { S3Service } from 'src/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly cloud: S3Service,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findOne(id: string, relations: string[]) {
    return this.usersRepository.findOne({
      where: { id },
      relations,
    });
  }

  async updateProfile(
    id: string,
    payload: UpdateProfileDto,
    relations: string[],
  ) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    let newLogo = user.profile?.logo;
    if (payload.file) {
      newLogo = await this.cloud.upload({
        file: payload.file.createReadStream(),
        path: 'logos',
      });
      if (user.profile?.logo?.includes(this.config.get('YANDEX_BUCKET'))) {
        this.eventEmitter.emit(
          'delete_image',
          user.profile.logo.split('.net/')[1],
        );
      }
    }
    user.profile = { ...user.profile, ...payload };
    user.profile['logo'] = newLogo;
    return user;
  }
}
