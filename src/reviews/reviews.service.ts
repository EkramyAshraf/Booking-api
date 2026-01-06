import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dtos/create-review.dto';
import { BaseService } from 'src/common/base/base.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { Tour, TourDocument } from 'src/tours/schemas/tour.schema';

@Injectable()
export class ReviewsService extends BaseService<ReviewDocument> {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
  ) {
    super(reviewModel);
  }

  async createReview(dto: CreateReviewDto) {
    const review = await this.create(dto);
    await this.calcAvgRatingAndQuantity(dto.tour);
    return review;
  }

  async findReviews(queryString: any, filter = {}) {
    return await this.findAll(queryString, filter);
  }

  async getReview(id: string) {
    return await this.findOne(
      id,
      {
        path: 'user',
        select: 'name photo',
      },
      { path: 'tour', select: 'name ' },
    );
  }

  async deleteReview(id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) return null;
    const tourId = review.tour;

    const result = await this.delete(id);

    await this.calcAvgRatingAndQuantity(tourId);
    return result;
  }

  async updateReview(id: string, data: UpdateReviewDto) {
    const review = await this.update(id, data);
    if (review) {
      await this.calcAvgRatingAndQuantity(review.data.tour);
    }
    return review;
  }

  async calcAvgRatingAndQuantity(tourId: Types.ObjectId) {
    const result = await this.reviewModel.aggregate([
      //1)get all reviews on specific productId
      {
        $match: { tour: tourId },
      },
      {
        //2)group reviews based on productId
        $group: {
          _id: '$tour',
          avgRating: { $avg: '$rating' },
          ratingQuantity: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      await this.tourModel.findByIdAndUpdate(tourId, {
        ratingsAverage: Math.round(result[0].avgRating * 10) / 10,
        ratingsQuantity: result[0].ratingQuantity,
      });
    } else {
      await this.tourModel.findByIdAndUpdate(tourId, {
        ratingsAverage: 4.5,
        ratingsQuantity: 0,
      });
    }
  }
}
