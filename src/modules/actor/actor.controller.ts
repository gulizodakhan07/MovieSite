import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ActorService } from "./actor.service";
import { CreateActorDto } from "./dto/create-actor.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateCategoryDto } from "../category/dto/update-category.dto";
import { Protected } from "src/decorators/protected.decorator";
import { Roles } from "src/decorators/role.decorator";
import { UserRoles } from "../user/model/user.model";


@Controller('actors')
export class ActorController {
    constructor(private service: ActorService) { }


    // @Protected(true)
    // @Roles([UserRoles.admin])
    @Post('add')
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() payload: CreateActorDto,
        @UploadedFile() image: Express.Multer.File) {
        return await this.service.create({...payload, image })
    }


    // @Protected(true)
    // @Roles([UserRoles.admin])
    @Put('update/:id')
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateCategoryDto,
        @UploadedFile() image: Express.Multer.File) {
        if (image) {
            payload.image = image;
        }
        return await this.service.update(id, payload);
    }

    @Get()
    async getAll() {
        return await this.service.getAll()
    }

    @Get(':id')
    async getActorWithMovies(@Param('id',ParseIntPipe) id: number){
        return await this.service.getActorWithMovies(id)

    }
    // @Protected(true)
    // @Roles([UserRoles.admin])
    @Delete('delete/:id')
    async deleteActor(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id)
    }
}


