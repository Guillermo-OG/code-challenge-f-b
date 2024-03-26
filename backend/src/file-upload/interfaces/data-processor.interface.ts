import { Subscriber } from '../../subscribers/schemas/subscriber.schema';
import { Metrics } from '../../metrics/schemas/metrics.schema';

export interface DataProcessor {
  processSubscriberData(subscriberData: Subscriber): void;
  calculateAndSaveMetrics(): Promise<Metrics[]>;
}
