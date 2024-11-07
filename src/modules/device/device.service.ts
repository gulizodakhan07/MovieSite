// device.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Device } from './model/device.model';
import { CreateDeviceDto } from './dto/create.device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device)
    private readonly deviceModel: typeof Device,
  ) {}
  async saveDevice(createDeviceDto: CreateDeviceDto): Promise<Device[]> {
    const { userId, name } = createDeviceDto;

    const savedDevices: Device[] = [];

    for (const deviceName of name) {
      let device = await this.deviceModel.findOne({
        where: { userId, name: [deviceName] },
      });

      if (!device) {
        // Qurilma mavjud bo'lmasa, yangi yozuv sifatida qo'shish
        device = await this.deviceModel.create({
          userId,
          name: [deviceName],
        });
      }

      savedDevices.push(device);
    }

    return savedDevices;
  }

  async findAll(): Promise<Device[]> {
    return this.deviceModel.findAll({ include: { all: true } });
  }
}
