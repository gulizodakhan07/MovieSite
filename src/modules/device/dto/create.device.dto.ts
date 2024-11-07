// dto/create-device.dto.ts
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDeviceDto {
  @IsArray()
  @IsNotEmpty()
  name: string[];

  @IsNumber()
  userId: number;
}
