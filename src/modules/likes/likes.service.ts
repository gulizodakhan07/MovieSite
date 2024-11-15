// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/sequelize";
// import { Likes } from "./model/likes.model";
// import { CreateLikRequest } from "./interface/createLike.interface";

// @Injectable()
// export class LikeService{
//     constructor(@InjectModel(Likes) private likeModel: Likes){}
//     async createlike(payload: CreateLikRequest){
//         return await this.likeModel.create({
//             rating: payload.rating
//         })
//     }
// }