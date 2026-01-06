import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsDefined, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
export class CreateBookingDto {
  @IsOptional()
  @IsString()
  paid: boolean;

  @IsNumber()
  price: number;

  @IsDefined()
  @Transform(({ value }) => new Types.ObjectId(value))
  tour: any;

  @IsDefined()
  @Transform(({ value }) => new Types.ObjectId(value))
  user: any;
}
