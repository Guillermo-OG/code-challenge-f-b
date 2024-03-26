import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { MetricsCalculator } from './processors/metrics-calculator';
import { CsvFileParser } from './parsers/csv-file-parser';
import { ExcelFileParser } from './parsers/excel-file-parser';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriberSchema } from 'src/subscribers/schemas/subscriber.schema';
import { MetricsSchema } from 'src/metrics/schemas/metrics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Subscriber', schema: SubscriberSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Metrics', schema: MetricsSchema }]),
  ],
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    MetricsCalculator,
    CsvFileParser,
    ExcelFileParser,
  ],
  exports: [FileUploadService],
})
export class FileUploadModule {}
