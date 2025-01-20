import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ContentfulResponse } from './interfaces/contentful-response.interface';

@Injectable()
export class ContentfulService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchContentfulData(): Promise<ContentfulResponse | undefined | []> {
    const spaceId = this.configService.get<string>('CONTENTFUL_SPACE_ID');
    const environmentId = this.configService.get<string>(
      'CONTENTFUL_ENVIRONMENT_ID',
    );
    const contentType = this.configService.get<string>(
      'CONTENTFUL_CONTENT_TYPE',
    );
    const accessToken = this.configService.get<string>(
      'CONTENTFUL_ACCESS_TOKEN',
    );
    try {
      const response = await firstValueFrom(
        this.httpService.get<ContentfulResponse>(
          `https://cdn.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries?content_type=${contentType}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        ),
      );
      return response.data;
    } catch (error: any) {
      console.error('fetchContentfulData Error: ', error);
      return undefined;
    }
  }
}
