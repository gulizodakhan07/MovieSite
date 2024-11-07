import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Post('add')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async createMovie(
    @Body() payload: CreateMovieDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; video?: Express.Multer.File[] },
  ) {
    const image = files.image ? files.image[0] : null;
    const video = files.video ? files.video[0] : null;
    return this.movieService.createMovie({ ...payload, image, video });
  }
  @Get()
  async getAllMovies() {
    return await this.movieService.allMovie();
  }
  @Get('search')
  async search(@Query('query') query: string): Promise<any> {
    return await this.movieService.searchMovies(query);
  }

  @Get('filter')
  async getMovies(@Query('releaseYear') releaseYear: number) {
    if (releaseYear) {
      return this.movieService.filter(releaseYear);
    }
    return this.movieService.filter(2020);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateMovieDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File; vide?: Express.Multer.File },
  ) {
    const image = files.image ? files.image[0] : null;
    const video = files.vide ? files.vide[0] : null;
    return await this.movieService.updateMovie(id, {
      ...payload,
      image,
      video,
    });
  }

  @Delete(':id')
  async deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return await this.movieService.deleteMovie(id);
  }
  @Get(':id')
  async singleMovie(@Param('id', ParseIntPipe) id: number) {
    return await this.movieService.singleMovie(id);
  }
}
