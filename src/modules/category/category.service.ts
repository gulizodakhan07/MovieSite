import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryRequest } from './interface/createCategory.interface';
import { UpdateCategoryRequest } from './interface/updateCategory.interface';
import { Category } from './model/category.model';
import { UploadService } from '../upload/upload.service';
import { Movie } from '../movie/model/movie.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryModel: typeof Category,
    private uploadService: UploadService,
  ) {}

  // Kategoriya yaratish
  async createCategory(payload: CreateCategoryRequest): Promise<Category> {
    const imageUrl = payload.image
      ? await this.uploadService.uploadFile({
          file: payload.image,
          destination: 'uploads/category',
        })
      : null;
    console.log(imageUrl);

    return this.categoryModel.create({
      name: payload.name,
      image: imageUrl ? imageUrl.imageUrl : null,
    });
  }

  // Barcha kategoriyalarni olish
  async getCategories() {
    try {
      const categories = await this.categoryModel.findAll({
        include: { all: true },
      });
      return {
        message: 'Barcha kategoriyalar olish muvaffaqiyatli',
        statusCode: 200,
        data: categories,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Kategoriyalarni olishda xatolik yuz berdi',
        statusCode: 500,
        data: error.message,
      };
    }
  }

  // Kategoriya bo'yicha yangilash
  async updateCategory(id: number, payload: UpdateCategoryRequest) {
    try {
      // Faylni yangilash
      const image = await this.uploadService.uploadFile({
        file: payload.image,
        destination: 'uploads/category',
      });

      const category = await this.categoryModel.findByPk(id);
      if (!category) {
        return {
          message: 'Kategoriya topilmadi',
          statusCode: 404,
          data: null,
        };
      }

      // Kategoriya ma'lumotlarini yangilash
      category.name = payload.name;
      category.image = image.imageUrl;
      await category.save();

      return {
        message: 'Kategoriya muvaffaqiyatli yangilandi',
        statusCode: 200,
        data: category,
      };
    } catch (error) {
      return {
        message: 'Kategoriya yangilashda xatolik yuz berdi',
        statusCode: 500,
        data: error.message,
      };
    }
  }

  // Kategoriya o'chirish
  async deleteCategory(id: number) {
    try {
      const category = await this.categoryModel.findByPk(id);
      if (!category) {
        return {
          message: 'Kategoriya topilmadi',
          statusCode: 404,
          data: null,
        };
      }

      await category.destroy();
      return {
        message: 'Kategoriya muvaffaqiyatli ochirildi',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      return {
        message: 'Kategoriya ochirishda xatolik yuz berdi',
        statusCode: 500,
        data: error.message,
      };
    }
  }
  async getCategoryById(id: number) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      return 'Category topilmadi';
    }
    const single_category = await this.categoryModel.findOne({ where: { id } });
    return {
      message: 'success',
      statusCode: 200,
      data: single_category,
    };
  }
}
