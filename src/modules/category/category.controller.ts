import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Kategoriya yaratish (Create)
  @Post('/add')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() payload: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      payload.image = image;
    }
    return this.categoryService.createCategory(payload);
  }
  // Barcha kategoriyalarni olish (Read all)
  @Get()
  async getAllCategories() {
    return await this.categoryService.getCategories();
  }

  // Kategoriya yangilash (Update)
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      payload.image = image;
    }
    return await this.categoryService.updateCategory(id, payload);
  }

  // Kategoriya ID orqali olish (Read by ID)
  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    return await this.categoryService.getCategoryById(id);
  }

  // Kategoriya o'chirish (Delete)
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: number) {
    return await this.categoryService.deleteCategory(id);
  }
}
