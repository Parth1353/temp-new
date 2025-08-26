import { Document } from "mongoose";
export interface IPatient extends Document {
    name: string;
    severity: number;
    requestedBeds: number;
    status: "waiting" | "admitted" | "rolled_back";
    createdAt: Date;
}
declare const _default: import("mongoose").Model<IPatient, {}, {}, {}, Document<unknown, {}, IPatient, {}, {}> & IPatient & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Patient.d.ts.map