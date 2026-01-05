import { NotFoundException } from '@nestjs/common';
import { AnyKeys, Model } from 'mongoose';
import { ApiFeatures } from '../utils/api-features';
import { QueryDto } from '../dtos/query.dto';

export class BaseService<T> {
  constructor(protected readonly model: Model<T>) {}
  async delete(id: string) {
    const doc = await this.model.findByIdAndDelete(id);

    if (!doc) {
      throw new NotFoundException('No document found with that ID');
    }

    return {
      status: 'success',
      data: null,
    };
  }

  async update(id: string, data: Partial<T>) {
    const doc = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      throw new NotFoundException('No document found with that ID');
    }

    return {
      status: 'success',
      data: doc,
    };
  }

  async create(data: Partial<T>) {
    const doc = await this.model.create(data as any);

    return {
      status: 'success',
      data: doc,
    };
  }

  async findOne(id: string, ...popOptions: any) {
    let query = this.model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      throw new NotFoundException('No document found with that ID');
    }

    return {
      status: 'success',
      data: doc,
    };
  }

  async findAll(queryString: any = {}, filter = {}) {
    const features = new ApiFeatures(this.model.find(filter), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    // SEND RESPONSE
    return {
      status: 'success',
      results: doc.length,
      data: doc,
    };
  }
}
