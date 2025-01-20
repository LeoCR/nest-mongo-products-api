import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { PassportModule } from '@nestjs/passport';

describe('ReportsController', () => {
  let controller: ReportsController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let reportsService: ReportsService;
  let response: Response;

  const mockReportsService = {
    countProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);

    response = {
      setHeader: jest.fn(),
      send: jest.fn(),
    } as any;
  });

  describe('downloadReport', () => {
    it('should generate an Excel report and send it as a response', async () => {
      // Mock data
      const countMock = 2;
      const percentageMock = (countMock / 50) * 100;
      const mockProductsDeleted = {
        data: [
          {
            sysId: '1',
            sku: 'SKU1',
            name: 'Product1',
            brand: 'Brand1',
            category: 'Category1',
            price: 100,
            stock: 10,
            isDeleted: true,
          },
        ],
        total: 50,
        percentage: percentageMock.toFixed(2),
      };

      mockReportsService.countProducts.mockResolvedValue(mockProductsDeleted);

      await controller.downloadReport(
        'true',
        '2025-01-01',
        '2025-01-31',
        response,
      );

      // Verificaciones
      expect(mockReportsService.countProducts).toHaveBeenCalledWith({
        isDeleted: true,
        withPrice: true,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      });
      expect(response.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(response.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="report-products.xlsx"',
      );
      expect(response.send).toHaveBeenCalledWith(expect.any(Buffer));
    });

    it('should handle filters correctly', async () => {
      const mockProductsNonDeleted = {
        data: [
          {
            sysId: '2',
            sku: 'SKU2',
            name: 'Product2',
            brand: 'Brand2',
            category: 'Category2',
            price: 200,
            stock: 20,
            isDeleted: false,
          },
        ],
        total: 100,
        percentage: ((1 / 100) * 100).toFixed(2),
      };

      mockReportsService.countProducts.mockResolvedValue(
        mockProductsNonDeleted,
      );

      await controller.downloadReport(
        'false',
        '2025-01-01',
        '2025-01-31',
        response,
      );

      // Verificaciones
      expect(mockReportsService.countProducts).toHaveBeenCalledWith({
        isDeleted: false,
        withPrice: false,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      });
    });

    it('should handle no data scenario', async () => {
      mockReportsService.countProducts.mockResolvedValue({
        data: [],
        total: 0,
        percentage: '0.00',
      });

      await controller.downloadReport(
        'false',
        '2025-01-01',
        '2025-01-31',
        response,
      );

      expect(response.send).toHaveBeenCalledWith(expect.any(Buffer));
    });

    it('should handle errors gracefully', async () => {
      mockReportsService.countProducts.mockRejectedValue(
        new Error('Error generating report'),
      );

      await expect(
        controller.downloadReport('true', '2025-01-01', '2025-01-31', response),
      ).rejects.toThrow('Error generating report');
    });
  });
});
