"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LogSchema = new mongoose_1.Schema({
    action: {
        type: String,
        enum: ["REQUEST", "ALLOCATE", "ROLLBACK"],
        required: true,
    },
    patientName: { type: String, required: true },
    details: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)("Log", LogSchema);
//# sourceMappingURL=Log.js.map