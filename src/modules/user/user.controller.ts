// user.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRoles } from './model/user.model';
import { Roles } from 'src/decorators/role.decorator';
import { Protected } from 'src/decorators/protected.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Protected(true)
  @Roles([UserRoles.admin, UserRoles.user])
  @Post('/add')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() payload: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      payload.image = image;
    }
    return this.userService.create(payload);
  }

  // @Protected(true)
  // @Roles([UserRoles.admin,UserRoles.user])
  @Post('verify')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const { email, otp } = body;
    return await this.userService.verifyOtp(email, otp);
  }

  // @Protected(true)
  // @Roles([UserRoles.admin])
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  // @Protected(true)
  // @Roles([UserRoles.admin])
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.userService.findOne(id);
  }

  @Protected(true)
  @Roles([UserRoles.admin])
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      payload.image = image;
    }
    return await this.userService.update(id, payload);
  }

  @Protected(true)
  @Roles([UserRoles.admin])
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.userService.remove(id);
  }
}
