import * as mongoose from 'mongoose';

export const SubscriberSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  billingCycleDays: { type: Number, required: true },
  startDate: { type: Date, required: true },
  status: { type: String, required: true },
  statusDate: { type: Date, required: true },
  cancellationDate: { type: Date },
  amount: { type: Number, required: true },
  nextCycle: { type: Date, required: true },
  subscriberId: { type: String, required: true },
});

export interface Subscriber extends mongoose.Document {
  quantity: number;
  billingCycleDays: number;
  startDate: Date;
  status: string;
  statusDate: Date;
  cancellationDate?: Date;
  amount: number;
  nextCycle: Date;
  subscriberId: string;
}
