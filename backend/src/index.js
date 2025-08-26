"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const patient_1 = __importDefault(require("./routes/patient"));
const allocate_1 = __importDefault(require("./routes/allocate"));
const resource_1 = __importDefault(require("./routes/resource"));
const log_1 = __importDefault(require("./routes/log"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hospital_bed_alloc";
// API routes
app.use("/api/patient", patient_1.default);
app.use("/api/allocate", allocate_1.default);
app.use("/api/resources", resource_1.default);
app.use("/api/logs", log_1.default);
app.get("/", (req, res) => {
    res.send("Hospital Bed Allocation System Backend");
});
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
});
//# sourceMappingURL=index.js.map