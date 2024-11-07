import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { UploadModule } from '../upload/upload.module';
import { UploadService } from '../upload/upload.service';
import { Movie } from './model/movie.model';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Movie, ]),
    UploadModule,
    forwardRef(() => CategoryModule), // forwardRef() yordamida circular bog'lanishni hal qilish
  ],
  providers: [MovieService, UploadService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
