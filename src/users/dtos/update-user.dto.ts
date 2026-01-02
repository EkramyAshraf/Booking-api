import {
  IsString,
  IsOptional,
  MinLength,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  photo: string;

  @IsOptional()
  @IsString()
  role: string;
}
