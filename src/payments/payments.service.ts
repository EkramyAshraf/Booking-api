import { Injectable, NotFoundException, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from 'src/booking/schemas/booking.schema';
import { Request, Response } from 'express';
import express from 'express';

import { Tour, TourDocument } from 'src/tours/schemas/tour.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(
    private config: ConfigService,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
  ) {
    const stripeKey = this.config.get<string>('STRIPE_SECRET');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET is not defined');
    }
    this.stripe = new Stripe(stripeKey);
  }

  async checkoutSession(
    userId: string,
    bookingId: string,
    protocol: any,
    host: any,
  ) {
    //1)get booking based on bookingId
    const booking = await this.bookingModel.findOne({
      _id: bookingId,
      user: userId,
    });

    if (!booking) {
      throw new NotFoundException('there is no booking for this ID');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('there is no user for this ID');
    }
    const tour = await this.tourModel.findById(booking.tour);
    if (!tour) {
      throw new NotFoundException('there is no tour for this ID');
    }

    //2)create stripe checkout session
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: `Order for ${user.name}`,
            },
            unit_amount: booking.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${protocol}://${host}/my-tours`,
      cancel_url: `${protocol}://${host}/tour/${tour.slug}`,
      customer_email: user.email,
      client_reference_id: bookingId,
    });

    return {
      status: 'success',
      session,
    };
  }

  async createBookingCheckout(session: any) {
    console.log(session);
    const bookingId = session.client_reference_id;
    const price = session.amount_total / 100;

    //1)get cart based on cartId
    const user = await this.userModel.findOne({
      email: session.customer_email,
    });

    //2)create order with default payment type cash
    const booking = await this.bookingModel.findByIdAndUpdate(
      bookingId,
      {
        paid: true,
        paidAt: Date.now(),
      },
      { new: true, runValidators: true },
    );
    return booking;
  }

  async webhookCheckout(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    let event: any;
    const stripeWebhookSecret = this.config.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!stripeWebhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature']!;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        stripeWebhookSecret,
      );
    } catch (err: any) {
      return res.status(400).send(`⚠️  Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      await this.createBookingCheckout(event.data.object);

      res.status(200).json({
        received: true,
      });
    }
  }
}
