import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {

  @Get()
  getIndexPage(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'client', 'index.html'));
  }
}
