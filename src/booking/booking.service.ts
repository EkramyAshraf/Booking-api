import { Injectable, NotFoundException } from '@nestjs/common';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Tour, TourDocument } from 'src/tours/schemas/tour.schema';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class BookingService extends BaseService<BookingDocument> {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
  ) {
    super(bookingModel);
  }

  async createBooking(userId: string, tourId: string) {
    const tour = await this.tourModel.findById(tourId);
    if (!tour) throw new NotFoundException('Tour not found');
    return await this.bookingModel.create({
      user: new Types.ObjectId(userId),
      tour: new Types.ObjectId(tourId),
      price: tour.price,
    });
  }

  async getAllBookings() {
    return await this.findAll();
  }

  async getBooking(id: string) {
    return await this.findOne(
      id,
      {
        path: 'user',
        select: 'name photo',
      },
      { path: 'tour', select: 'name price' },
    );
  }

  async deleteBooking(id: string) {
    return await this.delete(id);
  }
}
