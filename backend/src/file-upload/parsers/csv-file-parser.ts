import { Injectable, BadRequestException } from '@nestjs/common';
import * as Papa from 'papaparse';
import * as moment from 'moment';
import { FileParser } from '../interfaces/file-parser.interface';

@Injectable()
export class CsvFileParser implements FileParser {
  async parseFile(file: Express.Multer.File): Promise<any[]> {
    const parsePromise = new Promise<any[]>((resolve, reject) => {
      Papa.parse(file.buffer.toString(), {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data.slice(1).map((row) => {
            // Skip header row
            // Parse and validate dates with format consideration for nextCycle
            const startDate = this.parseDate(row[2], false);
            const statusDate = this.parseDate(row[4], false);
            const cancellationDate = this.parseDate(row[5], false);
            const nextCycle = this.parseDate(row[7], true); // Different format

            if (!startDate || !statusDate || !nextCycle) {
              reject(
                new BadRequestException('Invalid date format in CSV file'),
              );
              return;
            }

            return {
              quantity: parseInt(row[0]),
              billingCycleDays: parseInt(row[1]),
              startDate,
              status: row[3],
              statusDate,
              cancellationDate,
              amount: parseFloat(row[6].replace(',', '.')),
              nextCycle,
              subscriberId: row[8],
            };
          });
          resolve(parsedData);
        },
        error: (error) => reject(error),
      });
    });
    return await parsePromise;
  }

  private parseDate(dateString: string, isNextCycle: boolean): Date | null {
    if (!dateString) return null;

    const formats = isNextCycle
      ? ['D/M/YYYY', 'D/M/YY', 'DD/MM/YYYY', 'DD/MM/YY'] // Specific formats for nextCycle
      : ['M/D/YY H:mm', 'M/D/YYYY H:mm', 'MM/DD/YY H:mm', 'MM/DD/YYYY H:mm']; // General formats

    for (const format of formats) {
      const parsedDate = moment(dateString, format, true);
      if (parsedDate.isValid()) {
        return parsedDate.toDate();
      }
    }

    return null; // Invalid date format
  }
}
