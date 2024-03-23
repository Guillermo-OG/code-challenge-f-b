import * as mongoose from 'mongoose';

export const MetricsSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  MRR: { type: Number, required: true },
  MRRNewSubscriptions: { type: Number, required: true },
  MRRRenewals: { type: Number, required: true },
  MRRChurn: { type: Number, required: true },
  ChurnRate: { type: Number, required: true },
  ARPU: { type: Number, required: true },
  SubscriberSegment: { type: String, required: true }, // Ejemplo: 'Nuevo', 'Existente'
  calculatedAt: { type: Date, default: Date.now },
});

export interface Metrics extends mongoose.Document {
  year: number;
  month: number;
  MRR: number;
  MRRNewSubscriptions: number;
  MRRRenewals: number;
  MRRChurn: number;
  ChurnRate: number;
  ARPU: number;
  SubscriberSegment: string;
  calculatedAt: Date;
}
