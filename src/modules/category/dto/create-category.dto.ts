import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCategoryRequest } from '../interface/createCategory.interface';

export class CreateCategoryDto implements Omit<CreateCategoryRequest, 'id'> {
  @IsString()
  @IsNotEmpty()
  name: string;
  image: any;
}
