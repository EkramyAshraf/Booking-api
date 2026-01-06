import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto from 'crypto';
export type BookingDocument = HydratedDocument<Booking>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Booking {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Tour',
  })
  tour: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ default: false })
  paid?: boolean;

  @Prop()
  paidAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.index({ tour: 1, user: 1 }, { unique: true });
