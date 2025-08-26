import { Schema, model, Document } from "mongoose";

export interface IResource extends Document {
  name: string;
  totalUnits: number;
  allocatedUnits: number;
}

const ResourceSchema = new Schema<IResource>({
  name: { type: String, required: true, unique: true },
  totalUnits: { type: Number, required: true },
  allocatedUnits: { type: Number, required: true },
});

export default model<IResource>("Resource", ResourceSchema);
