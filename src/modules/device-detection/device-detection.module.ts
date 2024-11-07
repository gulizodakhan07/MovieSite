// device-detection.module.ts
import { Module } from '@nestjs/common';
import { DeviceDetectionService } from './device-detection.service';
import { DeviceDetectionController } from './device.detection.controller';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [DeviceModule, UserModule, DeviceModule],
  providers: [DeviceDetectionService],
  controllers: [DeviceDetectionController],
})
export class DeviceDetectionModule {}
