// device-detection.service.ts
import { Injectable } from '@nestjs/common';
import * as DeviceDetector from 'device-detector-js';

@Injectable()
export class DeviceDetectionService {
  detectDevice(userAgent: string, clientHints: any) {
    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent);

    if (!userAgent) {
      userAgent = 'unknown';
    }
    // Qurilma turi, operatsion tizim va boshqalarni aniqlash
    const deviceType = device.device.type;
    const os = device.os.name;
    const browser = device.client.name;
    const brand = device.device.brand;
    const model = device.device.model;

    return `${brand || ''} ${model || ''} (${deviceType} - ${os} - ${browser})`;
  }
}
