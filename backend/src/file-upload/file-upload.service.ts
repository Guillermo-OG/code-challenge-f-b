import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber } from '../subscribers/schemas/subscriber.schema';
import { CsvFileParser } from './parsers/csv-file-parser';
import { ExcelFileParser } from './parsers/excel-file-parser';
import { MetricsCalculator } from './processors/metrics-calculator';
import { Metrics } from 'src/metrics/schemas/metrics.schema';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectModel('Subscriber')
    private readonly subscriberModel: Model<Subscriber>,
    private readonly csvFileParser: CsvFileParser,
    private readonly excelFileParser: ExcelFileParser,
    private readonly metricsCalculator: MetricsCalculator,
  ) {}

  async processFile(file: Express.Multer.File): Promise<any> {
    let parsedData: any[];

    if (file.originalname.endsWith('.csv')) {
      parsedData = await this.csvFileParser.parseFile(file);
    } else if (file.originalname.endsWith('.xlsx')) {
      parsedData = await this.excelFileParser.parseFile(file);
    } else {
      throw new BadRequestException('Invalid file format');
    }

    const metrics = await this.saveAndProcessData(parsedData);

    return {
      validRows: parsedData.length, // All parsed data is considered valid
      invalidRows: 0, // No separate validation in this service
      metrics,
    };
  }

  private async saveAndProcessData(data: any[]): Promise<Metrics[]> {
    const subscribers: Subscriber[] = data.map(
      (subscriberData) => new this.subscriberModel(subscriberData),
    );

    // Save subscribers and calculate metrics:
    await this.subscriberModel.insertMany(subscribers);
    for (const subscriber of subscribers) {
      this.metricsCalculator.processSubscriberData(subscriber);
    }
    return await this.metricsCalculator.calculateAndSaveMetrics();
  }
}
