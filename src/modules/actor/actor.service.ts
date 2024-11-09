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

        if (payload.movieId && Array.isArray(payload.movieId) && payload.movieId.length > 0) {
            const movies = await this.actorMovieModel.findAll({
                where: {
                    id: { [Op.in]: payload.movieId },
                },
            });

            // Tekshiruvlar uchun konsolga chop etish
            console.log(movies);

            // Bir vaqtning o'zida bir nechta yozuv qo'shish uchun bulkCreate qo'llaniladi

            console.log("ulanmoqda")
            const result = await this.assignMovieToActor(actor.id, payload.movieId);
            console.log("assign:", result)
        }

        return actor;
    }

    // async assignMovieToActor(actorId: number, movieIds: number[]): Promise<Actor> {
    //     const actor = await this.actorModel.findByPk(actorId);

    //     if (actor) {
    //         const movieAssignments = movieIds.map(movieId => ({
    //             actorId: actorId,
    //             movieId: movieId,
    //         }));
    //         await this.actorMovieModel.bulkCreate(movieAssignments);
    //     }

    //     return actor;
    // }


    async assignMovieToActor(actorId: number, movieId: number[]): Promise<Actor> {
        console.log("ulandi")
        const actor = await this.actorModel.findByPk(actorId);
        console.log("dfssssssssssssssssssssssss", actor.id)

        if (actor) {
            for (const movie of movieId) {
                await this.actorMovieModel.create({
                    actorId: actorId,
                    movieId: movie,
                });
                console.log(`actorId: ${actorId} \n movieId: ${movieId}`)
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