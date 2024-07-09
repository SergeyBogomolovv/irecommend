import { Inject, Injectable, Logger } from '@nestjs/common';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService, ConfigType } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UploadImageDto } from './dto/upload-image.dto';
import cloudConfig from './config/cloud.config';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client;
  constructor(
    @Inject(cloudConfig.KEY)
    cloudConfiguration: ConfigType<typeof cloudConfig>,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.s3Client = new S3Client(cloudConfiguration);
  }

  async upload(dto: UploadImageDto) {
    const fileName = uuid() + '.jpg';
    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.config.get('YANDEX_BUCKET'),
        Body: dto.file,
        Key: `${dto.path}/${fileName}`,
      },
    });

    parallelUploads3.on('httpUploadProgress', () => {
      this.logger.debug(
        `Uploading image to ${this.config.get('YANDEX_BUCKET')}`,
      );
    });

    await parallelUploads3.done();

    return `https://${this.config.get('YANDEX_BUCKET')}.storage.yandexcloud.net/${dto.path}/${fileName}`;
  }

  delete(url: string) {
    this.eventEmitter.emit('delete_image', url.split('.net/')[1]);
    return true;
  }

  @OnEvent('delete_image')
  async deleteFile(path: string) {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.config.get('YANDEX_BUCKET'),
          Key: path,
        }),
      );
      this.logger.debug(
        `Deleted ${path} from ${this.config.get('YANDEX_BUCKET')}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete ${path} from ${this.config.get('YANDEX_BUCKET')}`,
      );
    }
  }
}
