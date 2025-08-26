"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLog = addLog;
// Logger.ts
const Log_1 = __importDefault(require("./models/Log"));
async function addLog(action, patientName, details) {
    // TODO: Add error handling, transaction support
    await Log_1.default.create({ action, patientName, details });
}
//# sourceMappingURL=Logger.js.map