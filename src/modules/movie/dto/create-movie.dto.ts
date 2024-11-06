import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateMovieRequest } from '../interface';

export class CreateMovieDto implements Omit<CreateMovieRequest,'id'> {
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
