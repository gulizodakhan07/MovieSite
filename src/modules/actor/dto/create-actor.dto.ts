import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateActorrequest } from "../interfaces/createActor.interface";

export class CreateActorDto implements Omit<CreateActorrequest,'id'>{
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    bio: string
    image: any

    @IsOptional()
    movieIds?: number[];
}