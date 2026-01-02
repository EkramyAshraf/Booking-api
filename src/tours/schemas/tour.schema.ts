import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import slugify from 'slugify';

export type TourDocument = HydratedDocument<Tour>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Tour {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    maxLength: 40,
    minLength: 10,
  })
  name: string;

  @Prop({ default: 4.5, min: 1, max: 5 })
  ratingsAverage: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  priceDiscount: number;

  @Prop({ required: true })
  maxGroupSize: number;

  @Prop({ required: true, enum: ['easy', 'medium', 'difficult'] })
  difficulty: string;

  @Prop()
  slug: string;

  @Prop({ default: 0 })
  ratingsQuantity: number;

  @Prop({ required: true, trim: true })
  summary: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true })
  imageCover: string;

  @Prop({ required: true })
  images: string[];

  @Prop({ required: true })
  startDates: Date[];

  @Prop()
  passwordChangedAt: Date;
}

export const TourSchema = SchemaFactory.createForClass(Tour);

//Document Middleware
TourSchema.pre<TourDocument>('save', function (this: TourDocument) {
  this.slug = slugify(this.name, { lower: true });
});

TourSchema.virtual('durationWeeks').get(function (this: TourDocument) {
  return Math.round(this.duration / 7);
});
