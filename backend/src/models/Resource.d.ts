import { Document } from "mongoose";
export interface IResource extends Document {
    name: string;
    totalUnits: number;
    allocatedUnits: number;
}
declare const _default: import("mongoose").Model<IResource, {}, {}, {}, Document<unknown, {}, IResource, {}, {}> & IResource & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Resource.d.ts.map