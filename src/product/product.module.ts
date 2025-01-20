import { Module } from '@nestjs/common';

import { ProductController } from '../product/product.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../product/schema/product.schema';
import { PassportModule } from '@nestjs/passport';
import { ProductService } from './product.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
