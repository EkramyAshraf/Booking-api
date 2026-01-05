// common/dtos/query.dto.ts
import {
  IsOptional,
  IsString,
  IsNumberString,
  Allow,
  IsObject,
} from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  sort?: string | string[];

  @IsOptional()
  @IsString()
  fields?: string;

  @IsOptional()
  @IsObject()
  price?: { [key: string]: string };
  // dynamic filters (price, rating, difficulty, etc)

  [key: string]: any;
}
