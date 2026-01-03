import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tour, TourDocument } from './schemas/tour.schema';
import { Model, Types } from 'mongoose';
import { ApiFeatures } from '../utils/api-features';
import { CreateTourDto } from './dtos/create-tour.dto';

@Injectable()
export class ToursService {
  constructor(@InjectModel(Tour.name) private tourModel: Model<TourDocument>) {}

  async getAllTours(queryString: any): Promise<TourDocument[]> {
    const features = new ApiFeatures(this.tourModel.find(), queryString)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    return await features.query;
  }

  async createTour(data: Partial<TourDocument>) {
    const tour = await this.tourModel.create(data);
    if (tour.priceDiscount !== undefined && tour.priceDiscount >= tour.price) {
      throw new BadRequestException('price must be greater than priceDiscount');
    }
    return tour;
  }

  async getTour(id: string): Promise<TourDocument> {
    const tour = await this.tourModel
      .findById(id)
      .populate({ path: 'guides', select: 'name email role' });
    if (!tour) {
      throw new NotFoundException('tour is not found with this id');
    }
    return tour;
  }

  async updateTour(
    id: string,
    data: Partial<TourDocument>,
  ): Promise<TourDocument> {
    const tour = await this.tourModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      throw new NotFoundException('tour is not found with this id');
    }
    return tour;
  }

  async deleteTour(id: string): Promise<TourDocument | null> {
    return await this.tourModel.findByIdAndDelete(id);
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
