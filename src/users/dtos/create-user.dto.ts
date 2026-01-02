import {
  IsString,
  IsOptional,
  MinLength,
  IsEmail,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  passwordConfirm: string;

  @IsOptional()
  @IsString()
  @IsEnum(['admin', 'user', 'lead-guide', 'guide'], {
    message: 'Role must be either: admin, medium,lead-guide or guide',
  })
  role: string;
}
