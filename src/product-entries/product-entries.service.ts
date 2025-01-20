import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ContentfulService } from '../contentful/contentful.service';
import { parseProducts } from './utils/parse-products';
import { ProductService } from '../product/product.service';
import { CreateProductDtao } from 'src/product/dtao/create-product.input';
import { ContentfulResponse } from 'src/contentful/interfaces/contentful-response.interface';

@Injectable()
export class ProductEntriesService {
  private readonly logger = new Logger(ProductEntriesService.name);

  constructor(
    private readonly contentfulService: ContentfulService,
    private readonly productService: ProductService,
  ) {}

  @Cron('0 * * * *')
  async insertProducts() {
    console.log('Running the Cron Job for Contentful');
    this.logger.debug('Called when the current second is 45');
    const productsCreated = [];
    try {
      const contentfulData = await this.contentfulService.fetchContentfulData();
      console.log('Contentful Data:', contentfulData);

      if (contentfulData) {
        const products = parseProducts(contentfulData as ContentfulResponse);
        for (const product of products) {
          try {
            const productCreated = await this.productService.createProduct(
              product as CreateProductDtao,
            );
            productsCreated.push(productCreated);
          } catch (error: any) {
            const errorMsg =
              'ProductEntriesService.insertProducts.for-of Error: ' +
              JSON.stringify(error);
            console.error(errorMsg);
            this.logger.error(errorMsg);
          }
        }
      }
    } catch (error) {
      this.logger.error('ProductEntriesService.insertProducts Error:', error);
    }
  }
}
