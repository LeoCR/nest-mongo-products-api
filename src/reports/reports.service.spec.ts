import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Model } from 'mongoose';
import { Product } from '../product/schema/product.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('ReportsService', () => {
  let service: ReportsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let productModel: Model<Product>;
  const mockProductModel = {
    countDocuments: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    productModel = module.get<Model<Product>>(getModelToken(Product.name));
  });

  describe('countProducts', () => {
    it('should return filtered products and their percentage correctly', async () => {
      const totalMock = 1;
      mockProductModel.countDocuments.mockResolvedValue(1);

      mockProductModel.find.mockResolvedValue([
        {
          _id: '678ba468a15d6e105c5e5148',
          sysId: '4HZHurmc8Ld78PNnI1ReYh',
          createdAt: '2024-01-23T21:47:08.012Z',
          updatedAt: '2024-01-23T21:47:08.012Z',
          sku: 'ZIMPDOPD',
          name: 'Apple Mi Watch',
          brand: 'Apple',
          productModel: 'Mi Watch',
          currency: 'USD',
          category: 'Smartwatch',
          color: 'Rose Gold',
          price: 1410.29,
          stock: 7,
          isDeleted: true,
          __v: 0,
        },
      ]);

      const result = await service.countProducts({
        isDeleted: true,
        withPrice: true,
      });

      expect(result.data.length).toEqual(1);
      expect(result.total).toEqual(totalMock);
    });
  });
});
