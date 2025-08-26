"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Patient_1 = __importDefault(require("../models/Patient"));
const Resource_1 = __importDefault(require("../models/Resource"));
const PriorityQueue_1 = require("../src/PriorityQueue");
const Banker_1 = require("../src/Banker");
const Logger_1 = require("../src/Logger");
const router = (0, express_1.Router)();
// POST /api/allocate
router.post("/", async (_req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Fetch all waiting patients and ICU resource
        const patients = await Patient_1.default.find({ status: "waiting" }).session(session);
        const icu = await Resource_1.default.findOne({ name: "ICU_BED" }).session(session);
        if (!icu)
            throw new Error("ICU resource not found");
        // Build priority queue
        const pq = new PriorityQueue_1.PriorityQueue();
        patients.forEach((p) => pq.enqueue({ severity: p.severity, patientId: p._id.toString() }));
        let admitted = [];
        let rolledBack = [];
        let available = icu.totalUnits - icu.allocatedUnits;
        while (!pq.isEmpty()) {
            const item = pq.dequeue();
            if (!item)
                break;
            const patient = patients.find((p) => p._id.toString() === item.patientId);
            if (!patient)
                continue;
            // Banker's Algorithm check
            if ((0, Banker_1.isSafeState)(icu.allocatedUnits, patient.requestedBeds, available)) {
                // Safe: admit
                patient.status = "admitted";
                icu.allocatedUnits += patient.requestedBeds;
                available -= patient.requestedBeds;
                admitted.push(patient.name);
                await (0, Logger_1.addLog)("ALLOCATE", patient.name, `Admitted with ${patient.requestedBeds} beds`);
                await patient.save({ session });
            }
            else {
                // Unsafe: rollback
                patient.status = "rolled_back";
                rolledBack.push(patient.name);
                await (0, Logger_1.addLog)("ROLLBACK", patient.name, "Allocation unsafe, rolled back");
                await patient.save({ session });
            }
        }
        await icu.save({ session });
        await session.commitTransaction();
        res.json({ admitted, rolledBack });
    }
    catch (err) {
        await session.abortTransaction();
        res
            .status(500)
            .json({ error: "Allocation failed", details: err.message });
    }
    finally {
        session.endSession();
    }
});
exports.default = router;
//# sourceMappingURL=allocate.js.map