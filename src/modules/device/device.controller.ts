// device.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create.device.dto';
import { Device } from './model/device.model';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async createDevice(@Body() createDeviceDto: CreateDeviceDto) {
    return await this.deviceService.saveDevice(createDeviceDto);
  }
  @Get()
  async findAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }
}
