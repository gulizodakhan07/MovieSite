import { Injectable } from "@nestjs/common";
import { Subscription } from "./model/subscription.model";
import { CreateSubscriptionRequest } from "./interface/createSubscription";
import { UpdateSubscriptionRequest } from "./interface/updateSubscription.interface";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class SubscriptionService{
    constructor(@InjectModel(Subscription) private subscriptionModel: typeof Subscription){}
    async create(payload: CreateSubscriptionRequest){
        return await this.subscriptionModel.create({
            amount: payload.amount,
            startDate: payload.startDate,
            endDate: payload.endDate
        })
    }
    async update(id: number,updatedPayload: UpdateSubscriptionRequest){
        return await this.subscriptionModel.update({
            amount: updatedPayload.amount,
            startDate: updatedPayload.startDate,
            endDate: updatedPayload.endDate
        },{where:{id}})
    }
    async delete(id: number){

        return await this.subscriptionModel.destroy({where:{id}})

    }
}