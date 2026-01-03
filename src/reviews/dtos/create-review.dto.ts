import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  review: string;

  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @IsString()
  tour: string;

  @IsString()
  user: string;
}
