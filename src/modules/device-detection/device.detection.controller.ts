import { Controller, Get, Param, Req } from '@nestjs/common'; // Get import qilingan
import { UserService } from '../user/user.service';
import { DeviceService } from '../device/device.service';
import { DeviceDetectionService } from './device-detection.service';
import { CreateDeviceDto } from '../device/dto/create.device.dto';

// device-detection.controller.ts
@Controller('device-detection')
export class DeviceDetectionController {
  constructor(
    private readonly deviceDetectionService: DeviceDetectionService,
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
  ) {}

  @Get(':userId')
  async detectAndSaveDevice(
    @Req() req: Request,
    @Param('userId') userId: number,
  ) {
    // Foydalanuvchi mavjudligini tekshirish
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error(`Foydalanuvchi ${userId} topilmadi`);
    }

    const userAgent = req.headers['user-agent'] || '';
    const clientHints = req.headers;

    // detectDevice metodining qaytaradigan qiymatini tekshirish
    const deviceData = this.deviceDetectionService.detectDevice(
      userAgent,
      clientHints,
    );
    if (!deviceData) {
      throw new Error('Qurilma aniqlanmadi');
    }

    const createDeviceDto: CreateDeviceDto = {
      userId,
      name: [deviceData],
    };
    const savedDevice = await this.deviceService.saveDevice(createDeviceDto);

    return { message: 'Qurilma aniqlangan va saqlandi', data: savedDevice };
  }
}
