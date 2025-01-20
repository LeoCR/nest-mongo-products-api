import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateWriteOpResult } from 'mongoose';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const mockProductService = {
      findAll: jest.fn(),
      createProduct: jest.fn(),
      deleteBySku: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    })
      .overrideGuard(AuthGuard())
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findProducts', () => {
    it('should return a paginated list of products', async () => {
      const mockProducts = [
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
          isDeleted: false,
        },
      ];
      productService.findAll.mockResolvedValue(mockProducts as any);

      const result = await controller.findProducts(
        5,
        0,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      );

      expect(result).toEqual({
        data: mockProducts.slice(0, 5),
        total: mockProducts.length,
        limit: 5,
        skip: 0,
      });
      expect(productService.findAll).toHaveBeenCalledWith({
        filters: expect.any(Object),
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return success message', async () => {
      productService.deleteBySku.mockResolvedValue({
        modifiedCount: 1,
      } as UpdateWriteOpResult);

      const result = await controller.deleteProduct('ZIMPDOPD');

      expect(result).toEqual({
        message: 'The product was deleted successfully.',
      });
      expect(productService.deleteBySku).toHaveBeenCalledWith('ZIMPDOPD');
    });

    it('should return not found message if product does not exist', async () => {
      productService.deleteBySku.mockResolvedValue({
        modifiedCount: 0,
      } as UpdateWriteOpResult);

      const result = await controller.deleteProduct('INVALID_SKU');

      expect(result).toEqual({
        message: 'The product that you are looking does not exists.',
      });
      expect(productService.deleteBySku).toHaveBeenCalledWith('INVALID_SKU');
    });
  });
});
