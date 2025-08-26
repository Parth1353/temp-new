"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Resource_1 = __importDefault(require("../models/Resource"));
const router = (0, express_1.Router)();
// GET /api/resources
router.get("/", async (_req, res) => {
    try {
        const icu = await Resource_1.default.findOne({ name: "ICU_BED" });
        res.json(icu);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch ICU resource" });
    }
});
exports.default = router;
//# sourceMappingURL=resource.js.map