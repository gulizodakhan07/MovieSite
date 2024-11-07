import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UploadService } from '../upload/upload.service';
import { User } from './model/user.model';
import { Device } from '../device/model/device.model';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Device]), DeviceModule],
  controllers: [UserController],
  providers: [UserService, UploadService],
  exports: [UserService],
})
export class UserModule {}
