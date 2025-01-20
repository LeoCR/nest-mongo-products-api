export interface IProduct {
  sysId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  sku: string;
  name: string;
  brand: string;
  productModel: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
  isDeleted: boolean;
}

export interface IProductFilter extends Partial<IProduct> {
  startDate?: string | Date;
  endDate?: string | Date;
}
