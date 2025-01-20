import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Product extends Document {
  @Prop({
    type: String,
    required: true,
  })
  sysId: string;
  @Prop({
    type: Date,
    required: true,
  })
  createdAt: Date;
  @Prop({
    type: Date,
    required: true,
  })
  updatedAt: Date;
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  sku: string;
  @Prop({
    type: String,
    required: true,
  })
  name: string;
  @Prop({
    type: String,
    required: true,
  })
  brand: string;
  @Prop({
    type: String,
    required: true,
  })
  productModel: string;
  @Prop({
    type: String,
    required: true,
  })
  currency: string;
  @Prop({
    type: String,
    required: true,
  })
  category: string;
  @Prop({
    type: String,
    required: true,
  })
  color: string;
  @Prop({
    type: Number,
    required: true,
  })
  price: number;
  @Prop({
    type: Number,
    required: true,
  })
  stock: number;
  @Prop({
    type: Boolean,
  })
  isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
