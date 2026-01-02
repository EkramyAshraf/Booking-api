import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MaxLength,
  MinLength,
  IsEnum,
  IsArray,
  IsDate,
  ValidateIf,
} from 'class-validator';
export class CreateTourDto {
  @IsString()
  @MaxLength(40)
  @MinLength(10)
  name: string;

  @IsNumber()
  @IsOptional()
  @Max(5)
  @Min(1)
  ratingsAverage: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  priceDiscount: number;

  @IsNumber()
  @IsOptional()
  ratingsQuantity: number;

  @IsNumber()
  duration: number;

  @IsNumber()
  maxGroupSize: number;

  @IsString()
  @IsEnum(['easy', 'medium', 'difficult'], {
    message: 'Difficulty must be either: easy, medium, or difficult',
  })
  difficulty: string;

  @IsString()
  summary: string;

  @IsString()
  description: string;

  @IsString()
  imageCover: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  slug: string;

  @IsArray()
  @Type(() => Date)
  @IsDate({ each: true })
  startDates: Date[];
}
