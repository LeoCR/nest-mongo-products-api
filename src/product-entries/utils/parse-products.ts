import { ContentfulResponse } from 'src/contentful/interfaces/contentful-response.interface';
import { IProduct } from 'src/product/interfaces/product.interface';

export const parseProducts = (
  contentfulProductsResp: ContentfulResponse,
): IProduct[] => {
  const products = contentfulProductsResp.items.map((product) => {
    return {
      sysId: product.sys.id,
      createdAt: product.sys.createdAt,
      updatedAt: product.sys.updatedAt,
      sku: product.fields.sku,
      name: product.fields.name,
      brand: product.fields.brand,
      productModel: product.fields.model,
      category: product.fields.category,
      color: product.fields.color,
      price: product.fields.price,
      currency: product.fields.currency,
      stock: product.fields.stock,
      isDeleted: false,
    };
  });
  return products;
};
