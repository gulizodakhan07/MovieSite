import { PartialType } from "@nestjs/mapped-types";
import { CreateSubscritionDto } from "./create-subscrion.dto";
import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateSubscriptionDto extends PartialType(CreateSubscritionDto){
    @IsInt()
    @IsOptional()
    amount?: number;


    @IsString()
    @IsOptional()
    startDate?: string;

    @IsString()
    @IsOptional()
    endDate?: string;
}