import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve a list of products with optional filters',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 5,
    description: 'Number of products to return',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    example: 1,
    description: 'Number of products to skip for pagination',
  })
  @ApiQuery({
    name: 'sysId',
    required: false,
    type: String,
    description: 'Filter by system ID',
    example: '3LO1GPO3x1hjnVFzAp7V6S',
  })
  @ApiQuery({
    name: 'createdAt',
    required: false,
    type: String,
    description: 'Filter by creation date (ISO format)',
    example: '2024-01-20',
  })
  @ApiQuery({
    name: 'updatedAt',
    required: false,
    type: String,
    description: 'Filter by update date (ISO format)',
    example: '2024-01-23',
  })
  @ApiQuery({
    name: 'sku',
    required: false,
    type: String,
    description: 'Filter by product SKU',
    example: 'ZIMPDOPD',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    example: 'Apple Mi Watch',
    description: 'Filter by product name',
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    type: String,
    example: 'Apple',
    description: 'Filter by product brand',
  })
  @ApiQuery({
    name: 'productModel',
    required: false,
    type: String,
    example: 'Mi Watch',
    description: 'Filter by product model',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    type: String,
    description: 'Filter by currency',
    example: 'USD',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by product category',
    example: 'Smartwatch',
  })
  @ApiQuery({
    name: 'color',
    example: 'Rose Gold',
    required: false,
    type: String,
    description: 'Filter by product color',
  })
  @ApiQuery({
    name: 'price',
    required: false,
    type: String,
    description: 'Filter by product price',
    example: 100,
  })
  @ApiQuery({
    name: 'stock',
    required: false,
    type: String,
    description: 'Filter by product stock',
    example: 1,
  })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'Filter by deletion status',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of products returned successfully',
    example: {
      data: [
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
          __v: 0,
        },
      ],
      total: 1,
      limit: 5,
      skip: 0,
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async findProducts(
    @Query('limit') limit: number,
    @Query('skip') skip: number,
    @Query('sysId') sysId: string,
    @Query('createdAt') createdAt: string,
    @Query('updatedAt') updatedAt: string,
    @Query('sku') sku: string,
    @Query('name') name: string,
    @Query('brand') brand: string,
    @Query('productModel') productModel: string,
    @Query('currency') currency: string,
    @Query('category') category: string,
    @Query('color') color: string,
    @Query('price') price: string,
    @Query('stock') stock: string,
    @Query('isDeleted') isDeleted: boolean,
  ) {
    const productLimit = Number(limit) || 5;
    const productSkip = Number(skip) || 0;

    const products = await this.productService.findAll({
      filters: {
        sysId: sysId ? sysId : undefined,
        createdAt: createdAt ? createdAt : undefined,
        updatedAt: updatedAt ? updatedAt : undefined,
        sku: sku ? sku : undefined,
        name: name ? name : undefined,
        brand: brand ? brand : undefined,
        productModel: productModel ? productModel : undefined,
        currency: currency ? currency : undefined,
        category: category ? category : undefined,
        color: color ? color : undefined,
        price: price ? Number(price) : undefined,
        stock: stock ? Number(stock) : undefined,
        isDeleted: isDeleted ? isDeleted : false,
      },
    });

    const paginatedProducts = products.slice(
      productSkip,
      productSkip + productLimit,
    );

    return {
      data: paginatedProducts,
      total: products.length,
      limit: productLimit,
      skip: productSkip,
    };
  }

  @UseGuards(AuthGuard())
  @Delete(':sku')
  @ApiOperation({ summary: 'Delete a product by SKU' })
  @ApiParam({
    name: 'sku',
    type: String,
    description: 'SKU of the product to delete',
    example: 'O53YSHQL',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    example: {
      message: 'The product was deleted successfully.',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    example: {
      message: 'The product that you are looking does not exists.',
    },
  })
  async deleteProduct(@Param('sku') sku: string) {
    const { modifiedCount } = await this.productService.deleteBySku(sku);
    const isProductDeleted = modifiedCount > 0;

    const message =
      isProductDeleted === true
        ? 'The product was deleted successfully.'
        : 'The product that you are looking does not exists.';

    return {
      message,
    };
  }
}
