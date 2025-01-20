import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulService } from './contentful.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ContentfulResponse } from './interfaces/contentful-response.interface';

describe('ContentfulService', () => {
  let service: ContentfulService;
  let httpService: HttpService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(), // Mock del método `get` de HttpService
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const mockConfig = {
                CONTENTFUL_SPACE_ID: 'testSpaceId',
                CONTENTFUL_ENVIRONMENT_ID: 'testEnvironmentId',
                CONTENTFUL_CONTENT_TYPE: 'testContentType',
                CONTENTFUL_ACCESS_TOKEN: 'testAccessToken',
              };
              return mockConfig[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ContentfulService>(ContentfulService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch data from Contentful API', async () => {
    const mockResponse: AxiosResponse<ContentfulResponse> = {
      data: {
        sys: { type: 'Array' },
        total: 2,
        skip: 0,
        limit: 2,
        items: [
          {
            metadata: { tags: [], concepts: [] },
            sys: {
              id: '123',
              type: 'Entry',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              contentType: {
                sys: { type: 'Link', linkType: 'ContentType', id: 'product' },
              },
              locale: 'en-US',
            },
            fields: {
              sku: 'SKU123',
              name: 'Test Product',
              brand: 'Test Brand',
              model: 'Test Model',
              category: 'Test Category',
              color: 'Test Color',
              price: 100.0,
              currency: 'USD',
              stock: 10,
            },
          },
        ],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    const result = await service.fetchContentfulData();

    expect(result).toEqual(mockResponse.data);
    expect(httpService.get).toHaveBeenCalledWith(
      `https://cdn.contentful.com/spaces/testSpaceId/environments/testEnvironmentId/entries?content_type=testContentType`,
      {
        headers: { Authorization: `Bearer testAccessToken` },
      },
    );
  });
});
