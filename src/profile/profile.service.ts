import { Injectable, Logger } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.input';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddContactDto } from './dto/add-contact.input';
import { Contact } from '@app/shared/entities/contact.entity';
import { MessageResponse } from '@app/shared/dto/message.response';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
    private readonly cloud: S3Service,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
  ) {}

  async getProfileInfo(id: string, relations: string[]) {
    return this.usersService.findOneById(id, relations);
  }

  async updateProfile(
    id: string,
    payload: UpdateProfileDto,
    relations: string[],
  ) {
    const user = await this.usersService.findOneByIdOrFail(id, [
      ...relations,
      'profile',
    ]);
    let newLogo = user.profile.logo;
    if (payload.file) {
      this.logger.verbose(`Updating profile logo for user ${id}`);
      newLogo = await this.cloud.upload({
        file: payload.file.createReadStream(),
        path: 'logos',
      });
      if (user.profile.logo?.includes(this.config.get('YANDEX_BUCKET'))) {
        this.eventEmitter.emit(
          'delete_image',
          user.profile.logo.split('.net/')[1],
        );
      }
    }
    user.profile = { ...user.profile, ...payload, logo: newLogo };
    this.logger.verbose(`Updating profile for user ${id}`);
    return await this.usersService.update(user);
  }

  async addContact(id: string, payload: AddContactDto) {
    const user = await this.usersService.findOneByIdOrFail(id, [
      'profile.contacts',
    ]);
    user.profile.contacts.push(this.contactsRepository.create({ ...payload }));
    await this.usersService.update(user);
    return new MessageResponse('Контакт добавлен в ваш профиль');
  }

  async removeContact(id: string) {
    await this.contactsRepository.delete(id);
    this.logger.verbose(`Removing contact with ${id}`);
    return new MessageResponse('Контакт удален из вашего профиля');
  }
}
