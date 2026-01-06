import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
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
  tour: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

ReviewSchema.pre(/^find/, async function (this: any) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
});
