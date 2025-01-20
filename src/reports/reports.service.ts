import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Product } from '../product/schema/product.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async countProducts({
    isDeleted,
    withPrice,
    startDate,
    endDate,
  }: {
    isDeleted: boolean;
    withPrice?: boolean;
    startDate?: string;
    endDate?: string;
  }) {
    const filter: RootFilterQuery<Product> = {
      isDeleted,
    };

    if (withPrice || withPrice === false) {
      filter.price = withPrice === true ? { $gt: 0 } : { $eq: 0 };
    }

    if (startDate) {
      filter.updatedAt = {
        $gte: startDate,
        ...(endDate ? { $lte: endDate } : {}),
      };
    }
    const totalFilter = {
      updatedAt: filter.updatedAt,
      ...(filter.price ? { price: filter.price } : {}),
    };

    const total = await this.productModel.countDocuments(totalFilter);

    const products = await this.productModel.find(filter);
    return {
      data: products,
      total,
    };
  }
}
