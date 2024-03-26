import { BadRequestException, Injectable } from '@nestjs/common';
import { FileParser } from '../interfaces/file-parser.interface';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { Express } from 'express';

type RowObject = {
  [key: string]: number | string | Date | null;
};

@Injectable()
export class ExcelFileParser implements FileParser {
  private parseValueByType(
    value: string | number,
    type: Function,
    columnName,
  ): number | string | Date | null {
    if (columnName === 'nextCycle' && value !== 0) {
      const parsedDate = moment(value, 'DD/MM/YYYY', true);
      if (parsedDate.isValid()) {
        return parsedDate.toDate();
      }
    }
    switch (type) {
      case Number:
        return typeof value === 'number'
          ? value
          : parseFloat(value.toString().replace(',', '.'));
      case String:
        return value.toString();
      case Date:
        return this.parseDate(value);
      default:
        throw new BadRequestException(`Unsupported type: ${typeof type}`);
    }
  }

  private parseDate(value: string | number): Date | null {
    if (!value) return null;
    const formats = [
      'M/D/YY',
      'M/D/YYYY',
      'MM/DD/YY',
      'MM/DD/YYYY',
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    ];
    if (typeof value === 'number') {
      return moment(value).toDate();
    } else {
      for (const format of formats) {
        const parsedDate = moment(value, format, true);
        if (parsedDate.isValid()) {
          return parsedDate.toDate();
        }
      }
    }
    throw new BadRequestException(`Invalid date format: ${value}`);
  }

  async parseFile(file: Express.Multer.File): Promise<RowObject[]> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Assuming first sheet
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils
      .sheet_to_json(worksheet, { header: 1, raw: false })
      .slice(1); // Skip headers

    const columnTypes = [
      Number,
      Number,
      String,
      String,
      String,
      String,
      Number,
      String,
      String,
    ];
    const columnNames = [
      'quantity',
      'billingCycleDays',
      'startDate',
      'status',
      'statusDate',
      'cancellationDate',
      'amount',
      'nextCycle',
      'subscriberId',
    ];

    return data.map((row: any) => {
      return row.reduce((acc, value, index) => {
        if (index < columnTypes.length) {
          // Ensure we don't exceed the expected number of columns
          const key = columnNames[index];
          acc[key] = this.parseValueByType(
            value,
            columnTypes[index],
            columnNames[index],
          );
        }
        return acc;
      }, {} as RowObject);
    });
  }
}
