import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { CreateSubscritionDto } from "./dto/create-subscrion.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";

@Controller('subscription')
export class SubscriptionController{
    constructor(private service: SubscriptionService){}
    @Post('add')
    async create(@Body() payload: CreateSubscritionDto){
        return await this.service.create(payload)
    }

    @Put('update/:')
    async update(@Param('id',ParseIntPipe) id: number,@Body() payload: UpdateSubscriptionDto){
        return await this.service.update(id,payload)
    }
    @Delete()
    async delete(@Param('id',ParseIntPipe) id: number){
        return await this.service.delete(id)
    }
}