import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import cloudConfig from './config/cloud.config';

@Module({
  imports: [ConfigModule.forFeature(cloudConfig)],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
