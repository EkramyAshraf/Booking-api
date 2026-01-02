import { IsString, MinLength } from 'class-validator';
export class UpdateUserPasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @MinLength(8)
  passwordConfirm: string;
}
