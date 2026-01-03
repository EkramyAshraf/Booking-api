import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';

enum GeoType {
  POINT = 'Point',
}

export class StartLocationDto {
  @IsEnum(GeoType)
  type: GeoType;

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  coordinates: number[];

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class LocationDto extends StartLocationDto {
  @IsOptional()
  @IsNumber()
  day?: number;
}
