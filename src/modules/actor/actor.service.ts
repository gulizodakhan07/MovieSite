import { Injectable } from "@nestjs/common";
import { Actor } from "./model/actor.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateActorrequest } from "./interfaces/createActor.interface";
import { UploadService } from "../upload/upload.service";
import { UpdateActorRequest } from "./dto/update-actor";
import { Movie } from "../movie/model/movie.model";
import { ActorMovie } from "./model/actorMovie.model";
import { Op } from "sequelize";

@Injectable()
export class ActorService {
    constructor(
        @InjectModel(Actor) private actorModel: typeof Actor,
        @InjectModel(ActorMovie) private actorMovieModel: typeof ActorMovie,
        private uploadService: UploadService) { }

        async create(payload: CreateActorrequest) {
            const imageUrl = payload.image
                ? await this.uploadService.uploadFile({
                    file: payload.image,
                    destination: 'uploads/actor',
                })
                : null;
        
            const actor = await this.actorModel.create({
                name: payload.name,
                bio: payload.bio,
                image: imageUrl?.imageUrl || null,
            });
        
            let movieIds: number[] = [];
        
            if (Array.isArray(payload.movieId)) {
                movieIds = payload.movieId
                    .map(id => Number(id))     
                    .filter(id => !isNaN(id));   
            } else {
                const id = Number(payload.movieId);
                if (!isNaN(id)) {
                    movieIds = [id];
                }
            }
        
            console.log("MovieIds:", movieIds);  
        
            const movies = await this.actorMovieModel.findAll({
                where: {
                    movieId: { [Op.in]: movieIds },
                },
            });
        
            if (movies.length === 0) {
                console.log("No movies found for the provided movieIds.");
            } else {
                console.log("Movies found:", movies);
            }
        
            console.log("ulanmoqda");
            const result = await this.assignMovieToActor(actor.id, movieIds);
            console.log("assign:", result);
        
            return actor;
        }
        
        async assignMovieToActor(actorId: number, movieIds: number[]): Promise<Actor> {
            console.log("ulandi");
            const actor = await this.actorModel.findByPk(actorId);
            if (!actor) {
                throw new Error(`Actor with ID ${actorId} not found.`);
            }
        
            console.log("Actor ID:", actor.id);
        
            if (actor) {
                for (const movie of movieIds) {
                    await this.actorMovieModel.create({
                        actorId: actorId,
                        movieId: movie,
                    });
                    console.log(`Assigned actorId: ${actorId} to movieId: ${movie}`);
                }
            }
        
            return actor;
        }
        




    async update(id: number, payload: UpdateActorRequest) {
        const actor = await this.actorModel.findByPk(id)
        if (!actor) {
            return "Aktyor topilmadi"
        }
        if (actor.image) {
            if (payload.image) {
                const removeImage = await this.uploadService.removeFile({ fileName: actor.image })
            }
        }
        let updatedImageUrl = null;
        if (payload.image) {
            const image = await this.uploadService.uploadFile({
                file: payload.image,
                destination: 'uploads/user',
            });
            updatedImageUrl = image.imageUrl;
        }


        return await this.actorModel.update({
            name: payload.name ? payload.name : actor.name,
            bio: payload.bio ? payload.bio : actor.bio,
            image: updatedImageUrl ? updatedImageUrl : actor.image
        }, { where: { id } })
    }


    async getAll() {
        return await this.actorModel.findAll({
            include: {
                model: Movie,
                through: { attributes: [] },
            },
        })
    }
    async getActorWithMovies(actorId: number) {
        return this.actorModel.findOne({
            where: { id: actorId },
            include: {
                model: Movie,
                through: { attributes: [] },
            },
        });
    }

    async delete(id: number) {
        const actor = await this.actorModel.findByPk(id)
        if (actor.image) {
            const image = await this.uploadService.removeFile({ fileName: actor.image })

        }

        return await this.actorModel.destroy({ where: { id } })

    }



}