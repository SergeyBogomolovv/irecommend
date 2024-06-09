import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { Contact, SharedModule } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 'src/s3/s3.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Contact]),
    S3Module,
    UsersModule,
  ],
  providers: [ProfileResolver, ProfileService],
})
export class ProfileModule {}
