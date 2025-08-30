import { Schema, model, Document } from 'mongoose';

export interface ILog extends Document {
  action: 'REQUEST' | 'ALLOCATE' | 'ROLLBACK';
  patientName: string;
  details: string;
  timestamp: Date;
}

const LogSchema = new Schema<ILog>({
  action: {
    type: String,
    enum: ['REQUEST', 'ALLOCATE', 'ROLLBACK'],
    required: true,
  },
  patientName: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default model<ILog>('Log', LogSchema);
