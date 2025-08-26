"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ResourceSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    totalUnits: { type: Number, required: true },
    allocatedUnits: { type: Number, required: true },
});
exports.default = (0, mongoose_1.model)("Resource", ResourceSchema);
//# sourceMappingURL=Resource.js.map