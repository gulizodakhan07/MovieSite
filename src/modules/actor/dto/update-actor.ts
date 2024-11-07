import { PartialType } from "@nestjs/mapped-types";
import { CreateActorDto } from "./create-actor.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateActorRequest extends PartialType(CreateActorDto) implements Omit<UpdateActorRequest,'id'>{

    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    bio?: string

    image?: any
}