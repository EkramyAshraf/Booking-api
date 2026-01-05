import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tour, TourDocument } from './schemas/tour.schema';
import { Model, Types } from 'mongoose';
import { ApiFeatures } from '../common/utils/api-features';
import { CreateTourDto } from './dtos/create-tour.dto';
import { QueryDto } from 'src/common/dtos/query.dto';
import { BaseService } from 'src/common/base/base.service';
import { UpdateTourDto } from './dtos/update-tour.dto';

@Injectable()
export class ToursService extends BaseService<TourDocument> {
  constructor(@InjectModel(Tour.name) private tourModel: Model<TourDocument>) {
    super(tourModel);
  }

  async getAllTours(queryString: any): Promise<any> {
    return await this.findAll(queryString);
  }

  async createTour(data: Partial<TourDocument>) {
    return await this.create(data);
  }

  async getTour(id: string): Promise<any> {
    return await this.findOne(
      id,
      { path: 'guides', select: 'name email role' },
      'reviews',
    );
  }

  async updateTour(id: string, data: UpdateTourDto): Promise<any> {
    return this.update(id, data);
  }

  async deleteTour(id: string): Promise<any | null> {
    return await this.delete(id);
  }

  async getTourStats() {
    return await this.tourModel.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $sum: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);
  }

  async getMonthlyPlan(year: string) {
    return await this.tourModel.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${parseInt(year)}-01-01`),
            $lte: new Date(`${parseInt(year)}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStats: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numToursStats: -1,
        },
      },
    ]);
  }
}
