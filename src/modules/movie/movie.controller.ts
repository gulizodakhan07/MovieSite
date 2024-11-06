import { Controller, Post, Body, UploadedFiles, UseInterceptors, Param, ParseIntPipe, Put, Delete, Get, Query, BadRequestException } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movie')
export class MovieController {
    constructor(private movieService: MovieService) { }

    @Post('add')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image', maxCount: 1 },
            { name: 'video', maxCount: 1 },
        ])
    )
    async createMovie(
        @Body() payload: CreateMovieDto,
        @UploadedFiles()
        files: { image?: Express.Multer.File[]; video?: Express.Multer.File[] }
    ) {
        const image = files.image ? files.image[0] : null;
        const video = files.video ? files.video[0] : null;
        return this.movieService.createMovie({ ...payload, image, video });
    }
    @Get(':id')
    async singleMovie(@Param('id', ParseIntPipe) id: number) {

        return await this.movieService.singleMovie(id)
    }


    @Get('search')
    async search(@Query('query') query: string) {
        return this.movieService.searchMovie(query);
    }

    @Get('filter')
    async getMovies(@Query('releaseYear') releaseYear: number) {
        if (releaseYear) {
            return this.movieService.filter(releaseYear);
        }
        // Boshqa filtrlar yoki barcha filmlarni olish
        return this.movieService.filter(2020); // Masalan, 2020-yil uchun filtr
    }



    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]))
    async updateMovie
        (@Param('id', ParseIntPipe) id: number,
            @Body() payload: UpdateMovieDto,
            @UploadedFiles() files: { image?: Express.Multer.File, vide?: Express.Multer.File }) {
        const image = files.image ? files.image[0] : null
        const video = files.vide ? files.vide[0] : null
        return await this.movieService.updateMovie(id, { ...payload, image, video })
    }


    @Delete(':id')
    async deleteMovie(@Param('id', ParseIntPipe) id: number) {
        return await this.movieService.deleteMovie(id)
    }
}
