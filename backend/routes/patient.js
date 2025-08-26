"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Patient_1 = __importDefault(require("../models/Patient"));
const Logger_1 = require("../src/Logger");
const router = (0, express_1.Router)();
// POST /api/patient
router.post("/", async (req, res) => {
    try {
        const { name, severity, requestedBeds } = req.body;
        const patient = await Patient_1.default.create({
            name,
            severity,
            requestedBeds,
            status: "waiting",
        });
        await (0, Logger_1.addLog)("REQUEST", name, `Requested ${requestedBeds} beds with severity ${severity}`);
        res.status(201).json(patient);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to admit patient" });
    }
});
// GET /api/patients
router.get("/", async (_req, res) => {
    try {
        const patients = await Patient_1.default.find().sort({ createdAt: -1 });
        res.json(patients);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch patients" });
    }
});
exports.default = router;
//# sourceMappingURL=patient.js.map