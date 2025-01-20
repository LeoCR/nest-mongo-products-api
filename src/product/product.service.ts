import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDtao } from './dtao/create-product.input';
import { IProductFilter } from './interfaces/product.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll({ filters }: { filters: Partial<IProductFilter> }) {
    const {
      startDate,
      endDate,
      sysId,
      createdAt,
      updatedAt,
      sku,
      name,
      brand,
      productModel,
      category,
      color,
      price,
      currency,
      stock,
      isDeleted,
    } = filters;
    const filter: RootFilterQuery<Product> = { isDeleted };

    if (startDate) {
      filter.createdAt = { $gte: startDate };
    }
    if (endDate) {
      filter.createdAt = { $lte: endDate };
    }
    if (sysId) {
      filter.sysId = { $eq: sysId };
    }

    if (createdAt) {
      filter.createdAt = { $gte: createdAt };
    }

    if (updatedAt) {
      filter.updatedAt = { $gte: updatedAt };
    }

    if (sku) {
      filter.sku = { $eq: sku };
    }

    if (name) {
      filter.name = { $eq: name };
    }

    if (brand) {
      filter.brand = { $eq: brand };
    }

    if (productModel) {
      filter.productModel = { $eq: productModel };
    }

    if (category) {
      filter.category = { $eq: category };
    }

    if (color) {
      filter.color = { $eq: color };
    }
    if (price) {
      filter.price = { $eq: price };
    }
    if (currency) {
      filter.currency = { $eq: currency };
    }

    if (stock) {
      filter.stock = { $eq: stock };
    }
    const products = await this.productModel.find(filter);

    return products;
  }

  async createProduct(createProductDtao: CreateProductDtao): Promise<Product> {
    const newProduct = this.productModel.create(createProductDtao);
    return newProduct;
  }

  async deleteBySku(sku: string) {
    const product = await this.productModel.updateOne(
      {
        sku,
      },
      {
        isDeleted: true,
      },
    );
    return product;
  }
}
