import { Schema, model, Document } from "mongoose";

export interface IPatient extends Document {
  name: string;
  severity: number;
  requestedBeds: number;
  status: "waiting" | "admitted" | "rolled_back";
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  severity: { type: Number, required: true },
  requestedBeds: { type: Number, required: true },
  status: {
    type: String,
    enum: ["waiting", "admitted", "rolled_back"],
    default: "waiting",
  },
  createdAt: { type: Date, default: Date.now },
});

export default model<IPatient>("Patient", PatientSchema);
