"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PatientSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("Patient", PatientSchema);
//# sourceMappingURL=Patient.js.map