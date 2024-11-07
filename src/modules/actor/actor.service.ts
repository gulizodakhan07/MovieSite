import { Injectable } from "@nestjs/common";
import { Actor } from "./model/actor.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateActorrequest } from "./interfaces/createActor.interface";
import { UploadService } from "../upload/upload.service";
import { UpdateActorRequest } from "./dto/update-actor";

@Injectable()
export class ActorService {
    constructor(@InjectModel(Actor) private actorModel: typeof Actor, private uploadService: UploadService) { }
    async create(payload: CreateActorrequest) {
        const imageUrl = payload.image
            ? await this.uploadService.uploadFile({
                file: payload.image,
                destination: 'uploads/actor',
            })
            : null;
        return await this.actorModel.create({
            name: payload.name,
            bio: payload.bio,
            image: imageUrl.imageUrl || null
        })
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
        },{where:{id}})
    }

    
    async getAll(){
        return await this.actorModel.findAll()
    }
    async delete(id: number){
        const actor = await this.actorModel.findByPk(id)
        if(actor.image){
            const image = await this.uploadService.removeFile({fileName: actor.image})

        }

        return await this.actorModel.destroy({where: {id}})
        
    }

}