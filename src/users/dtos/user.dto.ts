import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  name: string;
  @Expose()
  status: string;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  token: string;

  @Expose()
  message: string;

  @Expose()
  role: string;
}
