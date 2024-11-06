import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateMovieRequest, UpdateMovieRequest } from '../interface';

export class UpdateMovieDto implements Omit<UpdateMovieRequest,'id'> {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    releaseYear: number;
    image: any
    video: any
}
