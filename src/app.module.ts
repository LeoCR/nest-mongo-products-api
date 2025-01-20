import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductEntriesService } from './product-entries/product-entries.service';
import { ContentfulService } from './contentful/contentful.service';
import { ConfigModule } from '@nestjs/config';
import { ProductService } from './product/product.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product/schema/product.schema';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/user.schema';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.DB_URL + process.env.DB_HOST + ':' + process.env.DB_PORT,
      {
        dbName: process.env.DB_NAME,
      },
    ),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ReportsModule,
    AuthModule,
    UsersModule,
    ProductModule,
  ],
  providers: [ProductEntriesService, ContentfulService, ProductService],
})
export class AppModule {}
