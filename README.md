<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <a target="_blank" href="https://github.com/docker/compose" target="blank"><img src="https://raw.githubusercontent.com/docker/compose/v2/logo.png" alt="Docker Compose" title="Docker Compose Logo" width="120"></a>
  <a target="_blank" href="https://www.docker.com/" target="blank"><img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" alt="Docker Logo" title="Docker  Logo" width="120"></a>
<a target="_blank" href="https://www.mongodb.com/docs/" target="blank"  style="height:'30px';"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/MongoDB_Fores-Green.svg/1920px-MongoDB_Fores-Green.svg.png" alt="MongoDB Logo" title="MongoDB  Logo" width="120"></a>
</p>

## Description

API created with
[Nest.js](https://github.com/nestjs/nest) framework to fetch Products and Reports with JWT Authentication based on Data from [Contentful API](https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes).

This document describes the available endpoints and their functionality.

## Project setup

### 1. Define the Environment Variables

In order to define the Environment Variables please create a new empty file in the root of the project, than copy and paste these variables and then change your password and values with your real secrets:

```.env
PORT=3012
DB_URL=mongodb://your_mongodb_user:your_mongodb_password@
DB_HOST=localhost
DB_USERNAME=your_mongodb_user
DB_PASSWORD=your_mongodb_password
DB_PORT=27020
DB_NAME=your_mongodb_database_name

CONTENTFUL_SPACE_ID=your_contentful_space_id
CONTENTFUL_ENVIRONMENT_ID=your_contentful_environmnet_id
CONTENTFUL_CONTENT_TYPE=your_contentful_type
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token

NODE_VERSION=22.13.0

JWT_SECRET_KEY=your_jwt_secret_key
```

#### Create the Database with Docker

Make sure that you have [Docker](https://www.docker.com/products/docker-desktop/) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) installed before to run these commands inside the root of this project directory:

```bash
$ yarn run docker:build
$ yarn install
```

## Authentication

Some endpoints require authentication using a JWT token, in order to generate it use the `/auth/sign-in` endpoint

### Protected endpoints:

Require the access_token generated from `POST /auth/sign-in` endpoint

#### Delete Product :

DELETE `/products/:sku`

#### Download Product Report:

POST `/reports/download`

## Endpoints

You can Download and Import the [Postman Collection](https://github.com/LeoCR/nest-mongo-products-api/blob/main/Products-API-postman-collection.json) in order to execute all the endpoints

### 1. **Get Products**

**URL:** `/products`  
**Method:** `GET`

**Description:** Retrieves a list of products with optional filters and pagination.

#### Query Parameters:

| Parameter      | Type      | Required | Description                                  | Example       |
| -------------- | --------- | -------- | -------------------------------------------- | ------------- |
| `limit`        | `Number`  | No       | Number of products to return.                | `5`           |
| `skip`         | `Number`  | No       | Number of products to skip for pagination.   | `0`           |
| `sysId`        | `String`  | No       | Filter by system ID.                         | `12345`       |
| `createdAt`    | `String`  | No       | Filter by creation date (ISO format).        | `2024-01-01`  |
| `updatedAt`    | `String`  | No       | Filter by update date (ISO format).          | `2024-01-02`  |
| `sku`          | `String`  | No       | Filter by product SKU.                       | `SKU123`      |
| `name`         | `String`  | No       | Filter by product name.                      | `Laptop`      |
| `brand`        | `String`  | No       | Filter by product brand.                     | `BrandX`      |
| `productModel` | `String`  | No       | Filter by product model.                     | `Model123`    |
| `currency`     | `String`  | No       | Filter by currency.                          | `USD`         |
| `category`     | `String`  | No       | Filter by product category.                  | `Electronics` |
| `color`        | `String`  | No       | Filter by product color.                     | `Black`       |
| `price`        | `String`  | No       | Filter by product price.                     | `1000`        |
| `stock`        | `String`  | No       | Filter by product stock quantity.            | `50`          |
| `isDeleted`    | `Boolean` | No       | Filter deleted products (`true` or `false`). | `false`       |

#### Response:

```json
{
  "data": [
    {
      "sysId": "12345",
      "name": "Laptop",
      "brand": "BrandX",
      "price": 1000,
      "currency": "USD",
      "stock": 50,
      "isDeleted": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 5,
  "skip": 0
}
```

### 2. Delete a Product

**URL:** `/products/:sku`  
**Method:** `DELETE`

**Description:** Delete a Product setting the flag isDeleted as true in the MongoDB.

#### Parameters:

| Parameter | Type     | Required | Description        | Example    |
| --------- | -------- | -------- | ------------------ | ---------- |
| `sku`     | `String` | true     | SKU of the Product | `R4TJ1IVS` |

#### Response:

```json
{
  "message": "The product was deleted successfully."
}
```

### 3. **Download Products Reports**

**URL:** `/reports/download`  
**Method:** `POST`

**Description:** Retrieves an Microsoft Excel Report of products that were deleted and not.

#### Response:

A Microsoft Excel file.

#### Query Parameters:

| Parameter   | Type      | Required | Description                                               | Example      |
| ----------- | --------- | -------- | --------------------------------------------------------- | ------------ |
| `withPrice` | `Boolean` | No       | Is used to determine if the products have a price or not. | `true`       |
| `startDate` | `String`  | No       | Filter by creation date (ISO format).                     | `2024-01-01` |
| `endDate`   | `String`  | No       | Filter by update date (ISO format).                       | `2024-01-02` |

# Usage Examples

First we need to generate a JWT Token, to do that use the `/auth/sign-in` endpoint if you do not have a user execute the `/auth/sign-up` endpoint before, then copy and paste that token inside your Postman or Insomnia variables.

## POST Product Reports with Filters

To download the report you can do it from terminal executing the next Curl Request:

### Curl Request

`curl -X POST "http://localhost:3012/reports/download?whithPrice=true&startDate=2024-01-01&endDate=2025-01-01" -H "Authorization: Bearer your_access_token_here" -H "Accept: application/vnd.ms-excel" -o report-products.xlsx`

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Documentation

For more information about the Endpoints visit the [Swagger Documentation](http://localhost:3012/docs#/reports/ReportsController_downloadReport)

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
