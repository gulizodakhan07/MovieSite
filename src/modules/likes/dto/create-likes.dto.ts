import { IsEnum } from "class-validator";
import { CreateLikRequest } from "../interface/createLike.interface";

export class CreateLikeDto implements CreateLikRequest{
    @IsEnum([1,2,3,4,5])
    rating: [1, 2, 3, 4, 5];
}