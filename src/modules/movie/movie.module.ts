import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { UploadModule } from '../upload/upload.module';
import { Movie } from './model';
import { UploadService } from '../upload/upload.service';

@Module({
    imports: [SequelizeModule.forFeature([Movie])],
    providers: [MovieService,UploadService],
    controllers: [MovieController],
})
export class MovieModule {}
