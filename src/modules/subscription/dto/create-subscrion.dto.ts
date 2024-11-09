import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscritionDto{
    @IsInt()
    amount: number

    @IsString()
    @IsNotEmpty()
    startDate: string

    @IsString()
    @IsNotEmpty()
    endDate: string
}