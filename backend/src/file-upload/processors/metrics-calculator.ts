import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { Metrics } from '../../metrics/schemas/metrics.schema';
import { DataProcessor } from '../interfaces/data-processor.interface';
import { Subscriber } from '../../subscribers/schemas/subscriber.schema';

@Injectable()
export class MetricsCalculator implements DataProcessor {
  private metricsByMonth: { [month: number]: Metrics } = {};

  constructor(
    @InjectModel('Metrics') private readonly metricsModel: Model<Metrics>,
  ) {}

  processSubscriberData(subscriberData: Subscriber): void {
    const month = moment(subscriberData.startDate).month() + 1;

    // Update metrics
    if (!this.metricsByMonth[month]) {
      this.metricsByMonth[month] = new this.metricsModel({
        year: moment(subscriberData.startDate).year(),
        month,
        MRR: 0,
        MRRNewSubscriptions: 0,
        MRRRenewals: 0,
        MRRChurn: 0,
        ChurnRate: 0,
        ARPU: 0,
        SubscriberSegment: 'All',
      });
    }

    const metrics = this.metricsByMonth[month];
    if (subscriberData.status === 'Ativa') {
      metrics.MRR += subscriberData.amount;
      if (moment(subscriberData.startDate).isSame(moment(), 'month')) {
        metrics.MRRNewSubscriptions += subscriberData.amount;
      } else {
        metrics.MRRRenewals += subscriberData.amount;
      }
    } else if (subscriberData.status === 'Cancelada') {
      metrics.MRRChurn += subscriberData.amount;
    }
  }

  async calculateAndSaveMetrics(): Promise<Metrics[]> {
    const savedMetrics: Metrics[] = [];

    for (const month in this.metricsByMonth) {
      const metrics = this.metricsByMonth[month];
      const totalSubscribers =
        metrics.MRR + metrics.MRRNewSubscriptions + metrics.MRRRenewals;
      metrics.ARPU = totalSubscribers > 0 ? metrics.MRR / totalSubscribers : 0;
      metrics.ChurnRate =
        metrics.MRR > 0 ? (metrics.MRRChurn / metrics.MRR) * 100 : 0;
      await metrics.save();
      savedMetrics.push(metrics);
    }

    return savedMetrics;
  }
}
