import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRoles } from '../model';
import { UpdateUserRequest } from '../interfaces';

export class UpdateUserDto extends PartialType(CreateUserDto) implements Omit<UpdateUserRequest, 'id'> {

    @IsString()
    name?: string;

    @IsEmail()
    email?: string;

    @IsBoolean()
    isPremium?: boolean;

    image?: any;

    @IsEnum(UserRoles)
    role?: UserRoles;
    
}
