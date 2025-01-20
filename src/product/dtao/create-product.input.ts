import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDtao {
  @IsString()
  @IsNotEmpty()
  sysId: string;

  @IsString()
  @IsNotEmpty()
  createdAt: Date | string;

  @IsString()
  @IsNotEmpty()
  updatedAt: Date | string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  productModel: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}
