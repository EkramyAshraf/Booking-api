import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/users/auth/decorators/roles.decorator';
import { RoleGuards } from 'src/guards/roles.guard';
import { CurrentUser } from 'src/users/auth/decorators/currentUser.decorator';
import { Types } from 'mongoose';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Controller('api/v1/booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Roles('user')
  @UseGuards(AuthGuard, RoleGuards)
  @Post('/:tourId')
  async CreateBooking(
    @CurrentUser() user: any,
    @Param('tourId') tourId: string,
  ) {
    const booking = await this.bookingService.createBooking(user._id, tourId);
    return booking;
  }

  @Roles('user')
  @UseGuards(AuthGuard, RoleGuards)
  @Get()
  async getAllBookings() {
    return await this.bookingService.getAllBookings();
  }

  @Roles('user')
  @UseGuards(AuthGuard, RoleGuards)
  @Get('/:bookingId')
  async getBooking(@Param('bookingId') bookingId: string) {
    return await this.bookingService.getBooking(bookingId);
  }

  @Roles('user')
  @UseGuards(AuthGuard, RoleGuards)
  @Delete('/:bookingId')
  async deleteBooking(@Param('bookingId') bookingId: string) {
    return await this.bookingService.deleteBooking(bookingId);
  }
}
