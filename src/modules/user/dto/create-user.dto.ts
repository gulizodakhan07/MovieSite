import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateUserRequest } from '../interfaces/createUser.interface';
import { UserRoles } from '../model/user.model';

export class CreateUserDto implements Omit<CreateUserRequest, 'id'> {
  @IsString()
  name: string;

  @IsEmail({}, { message: "Noto'g'ri e-mail manzil formatida." })
  @IsNotEmpty({ message: 'E-mail manzil kiritilishi shart.' })
  email: string;

  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  image: any;

  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;
}
