import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { UsersModule } from 'src/users/users.module';
import { ToursModule } from 'src/tours/tours.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Tour, TourSchema } from 'src/tours/schemas/tour.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    UsersModule,
    ToursModule,
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Tour.name, schema: TourSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
