import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Actor } from "./model/actor.model";
import { ActorService } from "./actor.service";
import { ActorController } from "./actor.controller";
import { UploadModule } from "../upload/upload.module";
import { UploadService } from "../upload/upload.service";
import { ActorMovie } from "./model/actorMovie.model";
import { MovieService } from "../movie/movie.service";
import { Movie } from "../movie/model/movie.model";

@Module({
    imports: [SequelizeModule.forFeature([Actor,ActorMovie, Movie]),UploadModule],
    providers: [ActorService,UploadService, MovieService],
    controllers: [ActorController]
    
})
export class ActorModule{}