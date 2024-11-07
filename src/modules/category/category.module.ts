// category.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './model/category.model';
import { UploadModule } from '../upload/upload.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Category]),
    UploadModule,
    forwardRef(() => MovieModule),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
