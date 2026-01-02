import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  name: string;
  @Expose()
  status: string;

  @Expose()
  email: string;

  @Expose()
  _id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  token: string;

  @Expose()
  message: string;

  @Expose()
  role: string;
}
