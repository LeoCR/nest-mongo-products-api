import { Controller, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import * as XLSX from 'xlsx';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard())
  @Post('download')
  @ApiOperation({ summary: 'Download a report as an Excel file' })
  @ApiQuery({
    name: 'whithPrice',
    required: false,
    type: Boolean,
    example: true,
    description: 'Filter by price inclusion',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for the report',
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for the report',
    example: '2025-01-01',
  })
  @ApiResponse({
    status: 201,
    description: 'The report was generated and sent as a downloadable file',
  })
  @ApiOperation({ summary: 'Download a report as an Excel file' })
  @ApiResponse({
    status: 201,
    description: 'The report was generated and sent as a downloadable file',
  })
  async downloadReport(
    @Query('withPrice') withPrice: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const isWithPrice =
      withPrice === 'true' ? true : withPrice === 'false' ? false : undefined;

    const deletedProducts = await this.reportsService.countProducts({
      isDeleted: true,
      withPrice: isWithPrice,
      startDate,
      endDate,
    });

    const nonDeletedProducts = await this.reportsService.countProducts({
      isDeleted: false,
      withPrice: isWithPrice,
      startDate,
      endDate,
    });

    const total = nonDeletedProducts.data.length + deletedProducts.data.length;
    const nonDeletedProductsPercentage = Math.round(
      Number(((nonDeletedProducts.data.length / total) * 100).toFixed(2)),
    );

    const deletedProductsPercentage = Math.round(
      Number(((deletedProducts.data.length / total) * 100).toFixed(2)),
    );
    const statisticsSheetData = [
      [
        'Total of Products',
        'Quantity of Products Deleted',
        'Quantity of Products Non Deleted',
        'Percentage of Deleted Products',
        'Percentage of Non-Deleted Products',
      ],
      [
        total,
        deletedProducts.data.length,
        nonDeletedProducts.data.length,
        deletedProductsPercentage,
        nonDeletedProductsPercentage,
      ],
    ];
    const deletedSheetData = [
      [
        'ID',
        'SKU',
        'Name',
        'Brand',
        'Category',
        'Price',
        'Stock',
        'Is Deleted',
      ],
      ...deletedProducts.data.map((p) => [
        p.sysId,
        p.sku,
        p.name,
        p.brand,
        p.category,
        p.price,
        p.stock,
        p.isDeleted,
      ]),
      [],
      ['Total of Products', '', '', '', '', '', deletedProducts.total],
      [
        'Total of Deleted Products',
        '',
        '',
        '',
        '',
        '',
        deletedProducts.data.length,
      ],
      ['Percentage', '', '', '', '', '', `${deletedProductsPercentage}%`], // Ejemplo estático
    ];

    const nonDeletedSheetData = [
      [
        'ID',
        'SKU',
        'Name',
        'Brand',
        'Category',
        'Price',
        'Stock',
        'Is Deleted',
      ],
      ...nonDeletedProducts.data.map((p) => [
        p.sysId,
        p.sku,
        p.name,
        p.brand,
        p.category,
        p.price,
        p.stock,
        p.isDeleted,
      ]),
      [],
      ['Total of Products', '', '', '', '', '', nonDeletedProducts.total],
      [
        'Total of Non Deleted Products',
        '',
        '',
        '',
        '',
        '',
        nonDeletedProducts.data.length,
      ],
      ['Percentage', '', '', '', '', '', `${nonDeletedProductsPercentage}%`], // Ejemplo estático
    ];

    const workbook = XLSX.utils.book_new();
    const productsStatisticsSheet =
      XLSX.utils.aoa_to_sheet(statisticsSheetData);
    const deletedSheet = XLSX.utils.aoa_to_sheet(deletedSheetData);
    const nonDeletedSheet = XLSX.utils.aoa_to_sheet(nonDeletedSheetData);

    deletedSheet['!cols'] = [
      { wch: 25 }, // ID
      { wch: 25 }, // SKU
      { wch: 25 }, // Name
      { wch: 25 }, // Brand
      { wch: 15 }, // Category
      { wch: 10 }, // Price
      { wch: 25 }, // Stock
      { wch: 10 }, // Is Deleted
    ];

    nonDeletedSheet['!cols'] = [
      { wch: 25 }, // ID
      { wch: 25 }, // SKU
      { wch: 25 }, // Name
      { wch: 25 }, // Brand
      { wch: 15 }, // Category
      { wch: 10 }, // Price
      { wch: 25 }, // Stock
      { wch: 10 }, // Is Deleted
    ];

    productsStatisticsSheet['!cols'] = [
      { wch: 25 }, // Total of Products
      { wch: 30 }, // Quantity of Products Deleted
      { wch: 30 }, // Quantity of Products Non Deleted
      { wch: 35 }, // Percentage of Deleted Products
      { wch: 35 }, // Percentage of Non-Deleted Products
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      productsStatisticsSheet,
      'Statistics',
    );
    XLSX.utils.book_append_sheet(workbook, deletedSheet, 'Deleted Products');
    XLSX.utils.book_append_sheet(
      workbook,
      nonDeletedSheet,
      'Non-Deleted Products',
    );

    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="report-products.xlsx"',
    );

    res.send(excelBuffer);
  }
}
