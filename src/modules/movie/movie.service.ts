import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UploadService } from '../upload/upload.service';
import { Movie } from './model';
import { CreateMovieRequest, UpdateMovieRequest } from './interface';
import { searchMovies } from 'src/utils/search';



@Injectable()
export class MovieService {
    constructor(
        @InjectModel(Movie) private movieRepository: typeof Movie,
        private uploadService: UploadService
    ) { }

    async createMovie(payload: CreateMovieRequest): Promise<Movie> {
        const imageUrl = payload.image
            ? await this.uploadService.uploadFile({
                file: payload.image,
                destination: 'uploads',
            })
            : null;

        const videoUrl = payload.video
            ? await this.uploadService.uploadFile({
                file: payload.video,
                destination: 'uploads',
            })
            : null;

        return this.movieRepository.create({
            title: payload.title,
            description: payload.description,
            releaseYear: payload.releaseYear,
            image: imageUrl ? imageUrl.imageUrl : null,
            video: videoUrl ? videoUrl.imageUrl : null,
        });
    }


    async singleMovie(id: number) {
        const movie = await this.movieRepository.findByPk(id)
        if (!movie) {
            return "Kino topilmadi"
        }
        const singleMovie = await this.movieRepository.findOne({ where: { id } })
        return {
            message: "success",
            statusCode: 200,
            data: singleMovie
        }
    }



    async searchMovie(query: string) {

        const results =  searchMovies(query);
        return { message: 'success', statusCode: 200, data: results};
    }

    async filter(releaseYear: number) {
    return this.movieRepository.findAll({
        where: {
            releaseYear: releaseYear,
        },
    })
}


    // async allMovie(){


    // }



    async updateMovie(id: number, payload: UpdateMovieRequest){
    const movie = await this.movieRepository.findByPk(id)
    if (!movie) {
        return "Movie mavjud emas!"
    }
    if (payload.image) {
        if (movie.image) {
            await this.uploadService.removeFile({ fileName: movie.image })
        }
    }

    if (payload.video) {
        if (movie.video) {
            await this.uploadService.removeFile({ fileName: movie.video })
        }
    }
    let videoUrl = null
    let imageUrl = null

    if (payload.image) {
        const updatedImage = await this.uploadService.uploadFile({ file: payload.image, destination: 'uploads' })
        imageUrl = updatedImage.imageUrl
    }
    if (payload.video) {
        const updatedVideo = await this.uploadService.uploadFile({ file: payload.video, destination: 'uploads' })
        videoUrl = updatedVideo
    }
    const updatedPayload = await this.movieRepository.update({

        title: payload.title,
        description: payload.description,
        image: imageUrl ? imageUrl : movie.image,
        video: videoUrl ? videoUrl : movie.video,
        releaseYear: payload.relaseYear
    }, { where: { id: id }, returning: true },)

    return {
        message: 'success',
        statusCode: 200,
        data: updatedPayload
    };
}
    async deleteMovie(id: number){
    const movie = await this.movieRepository.findByPk(id)
    if (!movie) {
        return "Kino topilmadi"
    }
    if (movie.image) {
        await this.uploadService.removeFile({ fileName: movie.image })
    }
    if (movie.video) {
        await this.uploadService.removeFile({ fileName: movie.video })
    }
    const deletedMovie = await this.movieRepository.destroy({ where: { id } })
    return {
        message: 'success',
        statusCode: 200,
        data: deletedMovie
    }
}


}
