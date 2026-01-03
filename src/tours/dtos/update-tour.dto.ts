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
  ValidateNested,
} from 'class-validator';
import { LocationDto, StartLocationDto } from './geo-locations.dto';

enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  DIFFICULT = 'difficult',
}

export class UpdateTourDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  @MinLength(10)
  name: string;

  @IsOptional()
  @IsNumber()
  @Max(5)
  @Min(1)
  ratingsAverage: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  priceDiscount: number;

  @IsOptional()
  @IsNumber()
  ratingsQuantity: number;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  maxGroupSize: number;

  @IsOptional()
  @IsString()
  @IsEnum(Difficulty)
  difficulty: Difficulty;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => StartLocationDto)
  startLocation?: StartLocationDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  locations?: LocationDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  guides?: string[];
}
