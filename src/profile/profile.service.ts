import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';
import { User } from '@app/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddContactDto } from './dto/add-contact.dto';
import { Contact, Contacts } from '@app/shared/entities/contact.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,

    private readonly cloud: S3Service,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
    user.profile = { ...user.profile, ...payload, logo: newLogo };
    return await this.usersRepository.save(user);
  }

  async addContact(id: string, payload: AddContactDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    const contact = new Contact();
    contact.profile = user.profile;
    try {
      contact.type = Contacts[payload.type];
    } catch (error) {
      throw new BadRequestException('Вы указали неправильный тип контакта');
    }
    contact.url = payload.url;
    return await this.contactsRepository.save(contact);
  }

  async removeContact(id: string) {
    await this.contactsRepository.delete(id);
    return 'Контакт успешно удален';
  }
}
