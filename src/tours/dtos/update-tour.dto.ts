import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsArray,
  IsDate,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';
export class UpdateToursDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  @MinLength(10)
  name: string;

  @IsNumber()
  @IsOptional()
  @Max(5)
  @Min(1)
  ratingsAverage: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  ratingsQuantity: number;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  maxGroupSize: number;

  @IsOptional()
  @IsString()
  @IsEnum(['easy', 'medium', 'difficult'])
  difficulty: string;

  @IsOptional()
  @IsString()
  summary: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageCover: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  slug: string;

  @IsOptional()
  @IsArray()
  @Type(() => Date)
  @IsDate({ each: true })
  startDates: Date[];
}
