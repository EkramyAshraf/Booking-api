import { IsString, MinLength } from 'class-validator';
export class ResetUserPasswordDto {
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  passwordConfirm: string;
}
