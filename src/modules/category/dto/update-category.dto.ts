import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateCategoryRequest } from '../interface/updateCategory.interface';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto
  extends PartialType(CreateCategoryDto)
  implements Omit<UpdateCategoryRequest, 'id'>
{
  @IsString()
  @IsOptional()
  name?: string;
  image?: any;
}
