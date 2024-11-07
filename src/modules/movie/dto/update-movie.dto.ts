import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateMovieRequest } from '../interface/updateMovie.interface';

export class UpdateMovieDto implements Omit<UpdateMovieRequest, 'id'> {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  genre: string;

  @IsNumber()
  @IsOptional()
  releaseYear: number;
  image: any;
  video: any;
}
