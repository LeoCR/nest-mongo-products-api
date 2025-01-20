/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductEntriesService } from './product-entries.service';
import { ContentfulService } from '../contentful/contentful.service';
import { ProductService } from '../product/product.service';
import { Logger } from '@nestjs/common';

describe('ProductEntriesService', () => {
  let service: ProductEntriesService;
  let contentfulService: jest.Mocked<ContentfulService>;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    // Mock Logger methods
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductEntriesService,
        {
          provide: ContentfulService,
          useValue: {
            fetchContentfulData: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            createProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductEntriesService>(ProductEntriesService);
    contentfulService = module.get(ContentfulService);
    productService = module.get(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Otros tests...
});
