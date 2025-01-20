export interface Sys {
  type: string;
  linkType?: string;
  id?: string;
  space?: {
    sys: Sys;
  };
  environment?: {
    sys: Sys;
  };
  contentType?: {
    sys: Sys;
  };
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedVersion?: number;
  revision?: number;
}

export interface Metadata {
  tags: any[];
  concepts: any[];
}

export interface Fields {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
}

export interface Item {
  metadata: Metadata;
  sys: Sys;
  fields: Fields;
}

export interface ContentfulResponse {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: Item[];
}
