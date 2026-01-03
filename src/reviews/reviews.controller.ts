import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Roles } from '../users/auth/decorators/roles.decorator';
import { RoleGuards } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuards)
  async createReview(@Body() body: CreateReviewDto) {
    const review = await this.reviewsService.create(body);
    return {
      review,
    };
  }

  @Get()
  async getAllReviews() {
    const reviews = await this.reviewsService.find();
    return { reviews };
  }
}
