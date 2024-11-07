import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UploadService } from '../upload/upload.service';
import { searchMovies } from 'src/utils/search';
import { Movie } from './model/movie.model';
import { CreateMovieRequest } from './interface/createMovie.interface';
import { UpdateMovieRequest } from './interface/updateMovie.interface';
import { Console } from 'console';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie) private movieRepository: typeof Movie,
    private uploadService: UploadService,
  ) {}

  // Create a new movie
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
      genre: payload.genre,
      image: imageUrl ? imageUrl.imageUrl : null,
      video: videoUrl ? videoUrl.imageUrl : null,
      categoryId: payload.categoryId,
    });
  }

  // Get a single movie by ID
  async singleMovie(id: number) {
    const movie = await this.movieRepository.findByPk(id);
    if (!movie) {
      throw new BadRequestException('Movie not found');
    }

    return {
      message: 'Success',
      statusCode: 200,
      data: movie,
    };
  }

  // Search for movies based on a query
  async searchMovies(query: string) {
    if (!query || query.trim() === '') {
      throw new BadRequestException('Query parameter is required');
    }

    const results = await searchMovies(query);

    if (results.length === 0) {
      return {
        message: 'No movies found matching the query.',
        statusCode: 404,
        data: [],
      };
    }

    return {
      message: 'Success',
      statusCode: 200,
      data: results,
    };
  }

  // Filter movies by release year
  async filter(releaseYear: number) {
    return this.movieRepository.findAll({
      where: {
        releaseYear,
      },
    });
  }

  // Get all movies
  async allMovie() {
    return await this.movieRepository.findAll();
  }

  // Update an existing movie
  async updateMovie(id: number, payload: UpdateMovieRequest) {
    const movie = await this.movieRepository.findByPk(id);
    if (!movie) {
      throw new BadRequestException('Movie not found');
    }

    let imageUrl = movie.image;
    let videoUrl = movie.video;

    if (payload.image) {
      // Remove old image if updated
      if (imageUrl) {
        await this.uploadService.removeFile({ fileName: imageUrl });
      }
      const updatedImage = await this.uploadService.uploadFile({
        file: payload.image,
        destination: 'uploads',
      });
      imageUrl = updatedImage.imageUrl;
    }

    if (payload.video) {
      // Remove old video if updated
      if (videoUrl) {
        await this.uploadService.removeFile({ fileName: videoUrl });
      }
      const updatedVideo = await this.uploadService.uploadFile({
        file: payload.video,
        destination: 'uploads',
      });
      videoUrl = updatedVideo.imageUrl;
    }

    const [numberOfAffectedRows, updatedMovies] =
      await this.movieRepository.update(
        {
          title: payload.title,
          description: payload.description,
          genre: payload.genre,
          releaseYear: payload.releaseYear,
          image: imageUrl,
          video: videoUrl,
        },
        { where: { id }, returning: true },
      );

    if (numberOfAffectedRows === 0) {
      throw new BadRequestException('Failed to update movie');
    }

    return {
      message: 'Success',
      statusCode: 200,
      data: updatedMovies[0],
    };
  }

  // Delete a movie by ID
  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findByPk(id);
    if (!movie) {
      throw new BadRequestException('Movie not found');
    }

    if (movie.image) {
      await this.uploadService.removeFile({ fileName: movie.image });
    }

    if (movie.video) {
      await this.uploadService.removeFile({ fileName: movie.video });
    }

    const deletedMovie = await this.movieRepository.destroy({
      where: { id },
    });

    if (deletedMovie === 0) {
      throw new BadRequestException('Failed to delete movie');
    }

    return {
      message: 'Success',
      statusCode: 200,
      data: deletedMovie,
    };
  }
}
