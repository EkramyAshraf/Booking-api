import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dtos/create-tour.dto';
import { UpdateTourDto } from './dtos/update-tour.dto';
import { Roles } from '../users/auth/decorators/roles.decorator';
import { RoleGuards } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from 'src/users/auth/decorators/currentUser.decorator';
import { CreateReviewDto } from 'src/reviews/dtos/create-review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { Types } from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SharpPipe } from 'src/pipes/sharp.pipe';

@Controller('api/v1/tours')
export class ToursController {
  constructor(
    private toursService: ToursService,
    private reviewsService: ReviewsService,
  ) {}

  @Get()
  async getAllTours(@Query() queryString: any) {
    return await this.toursService.getAllTours(queryString);
  }

  @Post()
  @Roles('admin', 'lead-guide')
  @UseGuards(AuthGuard, RoleGuards)
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imageCover', maxCount: 1 },
        { name: 'images', maxCount: 3 },
      ],
      { storage: memoryStorage() },
    ),
  )
  async createTour(
    @UploadedFiles(SharpPipe) imageNames: any,
    @Body() body: CreateTourDto,
  ) {
    if (imageNames.imageCover) body.imageCover = imageNames.imageCover;
    if (imageNames.images) body.images = imageNames.images;
    return await this.toursService.createTour(body);
  }

  @Get('/tour-stats')
  @Roles('admin', 'user')
  @UseGuards(AuthGuard, RoleGuards)
  async getTourStats() {
    const stats = await this.toursService.getTourStats();
    return {
      status: 'success',
      data: {
        stats,
      },
    };
  }

  @Get('/monthly-plan/:year')
  @Roles('admin', 'lead-guide', 'guide')
  @UseGuards(AuthGuard, RoleGuards)
  @HttpCode(201)
  async getMonthlyPlan(@Param('year') year: string) {
    const plan = await this.toursService.getMonthlyPlan(year);
    return {
      status: 'success',
      data: {
        plan,
      },
    };
  }

  @Get('/:id')
  async getTour(@Param('id') id: string) {
    return await this.toursService.getTour(id);
  }

  @Patch('/:id')
  @Roles('admin', 'lead-guide')
  @UseGuards(AuthGuard, RoleGuards)
  @HttpCode(201)
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imageCover', maxCount: 1 },
        { name: 'images', maxCount: 3 },
      ],
      { storage: memoryStorage() },
    ),
  )
  async updateTour(
    @UploadedFiles(SharpPipe) imageNames: any,
    @Param('id') id: string,
    @Body() body: UpdateTourDto,
  ) {
    if (imageNames.imageCover) body.imageCover = imageNames.imageCover;
    if (imageNames.images) body.images = imageNames.images;
    return await this.toursService.updateTour(id, body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteTour(@Param('id') id: string) {
    return await this.toursService.deleteTour(id);
  }

  @Post('/:tourId/reviews')
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuards)
  @HttpCode(201)
  async createReviewForTour(
    @Param('tourId') tourId: string,
    @CurrentUser() user: any,
    @Body() body: CreateReviewDto,
  ) {
    const finalReviewData = {
      ...body,
      tour: new Types.ObjectId(tourId),
      user: user._id,
    };
    return await this.reviewsService.createReview(finalReviewData);
  }

  @Get('/:tourId/reviews')
  async getReviewsForTour(
    @Param('tourId') tourId: string,
    @Query() query: QueryDto,
  ) {
    let filter = { tour: tourId };
    return await this.reviewsService.findReviews(query, filter);
  }
}
