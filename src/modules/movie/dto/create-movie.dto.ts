import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateMovieRequest } from '../interface/createMovie.interface';

export class CreateMovieDto implements Omit<CreateMovieRequest, 'id'> {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsNumber()
  @IsNotEmpty()
  releaseYear: number;
  image: any;
  video: any;

  categoryId: string | number;
}
