import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Subscription } from "./model/subscription.model";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";

@Module({
    imports: [SequelizeModule.forFeature([Subscription])],
    providers: [SubscriptionService],
    controllers: [SubscriptionController]
})
export class SubscriptionModule{}