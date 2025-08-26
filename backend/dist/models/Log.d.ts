import { Document } from "mongoose";
export interface ILog extends Document {
    action: "REQUEST" | "ALLOCATE" | "ROLLBACK";
    patientName: string;
    details: string;
    timestamp: Date;
}
declare const _default: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<ILog, {}, {}, {}, Document<unknown, {}, ILog, {}, {}> & ILog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Log.d.ts.map