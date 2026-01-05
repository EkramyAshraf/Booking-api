import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Roles } from '../users/auth/decorators/roles.decorator';
import { RoleGuards } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';
import { QueryDto } from 'src/common/dtos/query.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuards)
  @HttpCode(201)
  async create(@Body() body: CreateReviewDto) {
    const review = await this.reviewsService.createReview(body);
    return {
      review,
    };
  }

  @Get()
  async getAllReviews(queryString: any) {
    const reviews = await this.reviewsService.findReviews(queryString);
    return { reviews };
  }

  @Get('/:id')
  async findReview(@Param('id') id: string) {
    return await this.reviewsService.getReview(id);
  }

  @Patch('/:id')
  async updateReview(@Param('id') id: string, @Body() body: UpdateReviewDto) {
    return await this.reviewsService.updateReview(id, body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteReview(@Param('id') id: string) {
    return await this.reviewsService.delete(id);
  }
}
