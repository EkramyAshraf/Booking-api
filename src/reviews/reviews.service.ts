import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dtos/create-review.dto';
import { BaseService } from 'src/common/base/base.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Injectable()
export class ReviewsService extends BaseService<ReviewDocument> {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {
    super(reviewModel);
  }

  async createReview(dto: CreateReviewDto) {
    return await this.create(dto);
  }

  async findReviews(queryString: any, filter = {}) {
    return await this.findAll(queryString, filter);
  }

  async getReview(id: string) {
    return this.findOne(
      id,
      {
        path: 'user',
        select: 'name photo',
      },
      { path: 'tour', select: 'name ' },
    );
  }

  async deleteReview(id: string) {
    return this.delete(id);
  }

  async updateReview(id: string, data: UpdateReviewDto) {
    return this.update(id, data as any);
  }
}
