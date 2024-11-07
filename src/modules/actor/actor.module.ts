import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Actor } from "./model/actor.model";
import { ActorService } from "./actor.service";
import { ActorController } from "./actor.controller";
import { UploadModule } from "../upload/upload.module";
import { UploadService } from "../upload/upload.service";

@Module({
    imports: [SequelizeModule.forFeature([Actor]),UploadModule],
    providers: [ActorService,UploadService],
    controllers: [ActorController]
    
})
export class ActorModule{}