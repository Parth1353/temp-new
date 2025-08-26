"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Log_1 = __importDefault(require("../models/Log"));
const router = (0, express_1.Router)();
// GET /api/logs
router.get("/", async (_req, res) => {
    try {
        const logs = await Log_1.default.find().sort({ timestamp: -1 });
        res.json(logs);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});
exports.default = router;
//# sourceMappingURL=log.js.map