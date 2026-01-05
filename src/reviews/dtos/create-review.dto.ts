import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsDefined,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';
export class CreateReviewDto {
  @IsString()
  review: string;

  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @IsOptional()
  @IsDefined()
  @Transform(({ value }) => new Types.ObjectId(value))
  tour: any;

  @IsOptional()
  @IsDefined()
  @Transform(({ value }) => new Types.ObjectId(value))
  user: any;
}
