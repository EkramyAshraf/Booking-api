import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  review: string;

  @IsOptional()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @IsOptional()
  @IsString()
  tour: string;

  @IsOptional()
  @IsString()
  user: string;
}
