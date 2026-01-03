import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import path from 'path';
import { Tour } from 'src/tours/schemas/tour.schema';
import { User } from 'src/users/schemas/user.schema';

export type ReviewDocument = HydratedDocument<Review>;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Review {
  @Prop({ required: true })
  review: string;

  @Prop({ required: true, max: 5, min: 1 })
  rating: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Tour' })
  tour: Tour | string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: User | string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre(/^find/, async function (this: any) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });
});
