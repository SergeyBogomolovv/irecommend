import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { SharedModule } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { S3Module } from 'src/s3/s3.module';
import { Contact } from '@app/shared/entities/contact.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User, Contact]), S3Module],
  providers: [ProfileResolver, ProfileService],
})
export class ProfileModule {}
