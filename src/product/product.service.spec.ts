import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateProductDtao } from './dtao/create-product.input';
import { IProductFilter } from './interfaces/product.interface';

describe('ProductService', () => {
  let productService: ProductService;
  let productModel: Model<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            updateOne: jest.fn(),
            // Simula el constructor del modelo
            constructor: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productModel = module.get<Model<Product>>(getModelToken(Product.name));
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const filters: IProductFilter = {
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        isDeleted: false,
      };

      const mockProducts = [
        { sysId: 1, name: 'Product 1' },
        { sysId: 2, name: 'Product 2' },
      ];

      jest.spyOn(productModel, 'find').mockResolvedValue(mockProducts as any);

      const result = await productService.findAll({ filters });
      expect(result).toEqual(mockProducts);
    });

    it('should filter products by isDeleted and other filters', async () => {
      const filters: IProductFilter = {
        isDeleted: true,
        sku: '12345',
      };

      const mockFilteredProducts = [{ sysId: 3, name: 'Product 3' }];

      jest
        .spyOn(productModel, 'find')
        .mockResolvedValue(mockFilteredProducts as any);

      const result = await productService.findAll({ filters });

      expect(result).toEqual(mockFilteredProducts);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDtao: CreateProductDtao = {
        sku: 'abc123',
        name: 'New Product',
        price: 100,
        stock: 10,
        sysId: '8239iosdfjfi',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        brand: 'BrandProduct',
        productModel: 'ModelProduct',
        currency: 'USD',
        category: 'Category',
        color: 'Red',
      };

      const mockProduct = {
        _id: 'mockId',
        sysId: createProductDtao.sysId,
        createdAt: new Date(createProductDtao.createdAt),
        updatedAt: new Date(createProductDtao.updatedAt),
        sku: createProductDtao.sku,
        name: createProductDtao.name,
        brand: createProductDtao.brand,
        productModel: createProductDtao.productModel,
        currency: createProductDtao.currency,
        category: createProductDtao.category,
        color: createProductDtao.color,
        price: createProductDtao.price,
        stock: createProductDtao.stock,
        isDeleted: false, // Por defecto, asumiendo que no es eliminado al crear
      };

      // Simula el método create
      jest.spyOn(productModel, 'create').mockResolvedValue(mockProduct as any);

      const result = await productService.createProduct(createProductDtao);

      expect(productModel.create).toHaveBeenCalledWith(createProductDtao);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('deleteBySku', () => {
    it('should delete a product by SKU', async () => {
      const sku = '12345';
      const mockResponse = { nModified: 1 };

      jest
        .spyOn(productModel, 'updateOne')
        .mockResolvedValue(mockResponse as any);

      const result = await productService.deleteBySku(sku);
      expect(productModel.updateOne).toHaveBeenCalledWith(
        { sku },
        { isDeleted: true },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return 0 if no product is found to delete', async () => {
      const sku = 'nonexistent';
      const mockResponse = { nModified: 0 };

      jest
        .spyOn(productModel, 'updateOne')
        .mockResolvedValue(mockResponse as any);

      const result = await productService.deleteBySku(sku);
      expect(productModel.updateOne).toHaveBeenCalledWith(
        { sku },
        { isDeleted: true },
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
