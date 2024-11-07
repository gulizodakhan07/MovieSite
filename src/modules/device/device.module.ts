// device.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { Device } from './model/device.model';

@Module({
  imports: [SequelizeModule.forFeature([Device])],
  providers: [DeviceService],
  controllers: [DeviceController],
  exports: [DeviceService],
})
export class DeviceModule {}
