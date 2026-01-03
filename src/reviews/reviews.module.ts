import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { UsersModule } from 'src/users/users.module';
import { ToursModule } from 'src/tours/tours.module';

@Module({
  imports: [
    UsersModule,
    ToursModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  providers: [ReviewsService],
  exports: [ReviewsService, MongooseModule],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
