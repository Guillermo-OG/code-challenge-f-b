import { Injectable, BadRequestException } from '@nestjs/common';
import * as Papa from 'papaparse';
import readExcelFile from 'read-excel-file/node';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber } from '../subscribers/schemas/subscriber.schema';
import { Metrics } from '../metrics/schemas/metrics.schema';
import * as moment from 'moment';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectModel('Subscriber')
    private readonly subscriberModel: Model<Subscriber>,
    @InjectModel('Metrics') private readonly metricsModel: Model<Metrics>,
  ) {}

  async processFile(file: Express.Multer.File): Promise<any> {
    let parsedData: any[];

    if (file.originalname.endsWith('.csv')) {
      const parsePromise = new Promise<any[]>((resolve, reject) => {
        Papa.parse(file.buffer.toString(), {
          header: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error),
        });
      });
      parsedData = await parsePromise;
    } else if (file.originalname.endsWith('.xlsx')) {
      const result = await readExcelFile(file.buffer, {
        schema: this.getExcelSchema(),
      });
      parsedData = result.rows;
    } else {
      throw new BadRequestException('Invalid file format');
    }

    await this.validateAndSaveData(parsedData);
  }

  private async validateAndSaveData(data: any[]): Promise<void> {
    const currentYear = moment().year();
    const currentMonth = moment().month() + 1; // Months are 0-indexed

    let activeSubscribers = 0;
    let totalRevenue = 0;
    let cancelledSubscribers = 0;
    let newSubscriptionsRevenue = 0;
    let renewalsRevenue = 0;
    let churnedRevenue = 0;

    for (const row of data) {
      // Validate and transform data before saving
      if (!this.validateRow(row)) continue; // Skip rows with invalid data

      const subscriberData = {
        quantity: parseInt(row.quantity),
        billingCycleDays: parseInt(row.billingCycleDays),
        startDate: moment(row.startDate, 'M/D/YYYY HH:mm').toDate(),
        status: row.status,
        statusDate: moment(row.statusDate, 'M/D/YYYY HH:mm').toDate(),
        cancellationDate: row.cancellationDate
          ? moment(row.cancellationDate, 'M/D/YYYY HH:mm').toDate()
          : null,
        amount: parseFloat(row.amount),
        nextCycle: moment(row.nextCycle, 'M/D/YYYY').toDate(),
        subscriberId: row.subscriberId,
      };

      const subscriber = new this.subscriberModel(subscriberData);
      await subscriber.save();

      if (subscriberData.status === 'Ativa') {
        activeSubscribers++;
        totalRevenue += subscriberData.amount;

        if (
          moment(subscriberData.startDate).year() === currentYear &&
          moment(subscriberData.startDate).month() + 1 === currentMonth
        ) {
          newSubscriptionsRevenue += subscriberData.amount;
        } else {
          renewalsRevenue += subscriberData.amount;
        }
      } else if (subscriberData.status === 'Cancelada') {
        cancelledSubscribers++;
        churnedRevenue += subscriberData.amount;
      }
    }

    const churnRate =
      activeSubscribers + cancelledSubscribers > 0
        ? (cancelledSubscribers / (activeSubscribers + cancelledSubscribers)) *
          100
        : 0;

    const ARPU = activeSubscribers > 0 ? totalRevenue / activeSubscribers : 0;

    const metrics = new this.metricsModel({
      year: currentYear,
      month: currentMonth,
      MRR: totalRevenue,
      MRRNewSubscriptions: newSubscriptionsRevenue,
      MRRRenewals: renewalsRevenue,
      MRRChurn: churnedRevenue,
      ChurnRate: churnRate,
      ARPU: ARPU,
      SubscriberSegment: 'All', // You can customize this based on your logic
    });

    await metrics.save();
  }

  private validateRow(row: any): boolean {
    // Example validation, add more checks as necessary
    return (
      row.quantity &&
      row.billingCycleDays &&
      row.startDate &&
      row.status &&
      row.statusDate &&
      row.amount &&
      row.nextCycle &&
      row.subscriberId &&
      moment(row.startDate, 'M/D/YYYY HH:mm', true).isValid() &&
      moment(row.statusDate, 'M/D/YYYY HH:mm', true).isValid() &&
      (!row.cancellationDate ||
        moment(row.cancellationDate, 'M/D/YYYY HH:mm', true).isValid()) &&
      moment(row.nextCycle, 'M/D/YYYY', true).isValid()
    );
  }

  private getExcelSchema() {
    return {
      quantity: {
        prop: 'quantity',
        type: Number,
        required: true,
      },
      billingCycleDays: {
        prop: 'billingCycleDays',
        type: Number,
        required: true,
      },
      startDate: {
        prop: 'startDate',
        type: String,
        required: true,
      },
      status: {
        prop: 'status',
        type: String,
        required: true,
      },
      statusDate: {
        prop: 'statusDate',
        type: String,
        required: true,
      },
      cancellationDate: {
        prop: 'cancellationDate',
        type: String,
        required: false,
      },
      amount: {
        prop: 'amount',
        type: Number,
        required: true,
      },
      nextCycle: {
        prop: 'nextCycle',
        type: String,
        required: true,
      },
      subscriberId: {
        prop: 'subscriberId',
        type: String,
        required: true,
      },
    };
  }
}
