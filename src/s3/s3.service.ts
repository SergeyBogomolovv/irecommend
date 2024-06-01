import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { OnEvent } from '@nestjs/event-emitter';
import { UploadImageDto } from './dto/upload-image.dto';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client = new S3Client({
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
    credentials: {
      accessKeyId: this.config.get('YANDEX_ACCESS'),
      secretAccessKey: this.config.get('YANDEX_SECRET'),
    },
  });
  constructor(private readonly config: ConfigService) {}

  async upload(dto: UploadImageDto) {
    const fileName = uuid() + '.jpg';
    this.logger.verbose(
      `Uploading image to ${this.config.get('YANDEX_BUCKET')}`,
    );
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.config.get('YANDEX_BUCKET'),
          Body: dto.file,
          Key: `${dto.path}/${fileName}`,
        }),
      );
      this.logger.verbose(
        `Uploaded image to ${this.config.get('YANDEX_BUCKET')} with name - ${fileName}`,
      );
      return `https://${this.config.get('YANDEX_BUCKET')}.storage.yandexcloud.net/${dto.path}/${fileName}`;
    } catch (error) {
      this.logger.error(`Failed to upload ${fileName}`);
      throw error;
    }
  }

  @OnEvent('delete_image')
  async delete(path: string) {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.config.get('YANDEX_BUCKET'),
          Key: path,
        }),
      );
      this.logger.verbose(
        `Deleted ${path} from ${this.config.get('YANDEX_BUCKET')}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete ${path} from ${this.config.get('YANDEX_BUCKET')}`,
      );
      return false;
    }
  }
}
