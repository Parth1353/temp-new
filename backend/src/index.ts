import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import patientRoutes from "./routes/patient";
import allocateRoutes from "./routes/allocate";
import resourceRoutes from "./routes/resource";
import logRoutes from "./routes/log";

dotenv.config();

const app = express();

// More open CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ], // Allow frontend and any origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/hospital_bed_alloc";

// API routes
app.use("/api/patient", patientRoutes);
app.use("/api/allocate", allocateRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
  res.send("Hospital Bed Allocation System Backend");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
);

// Catch-all 404 for API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

console.log("Attempting to connect to MongoDB at:", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(
        `📊 Health check available at http://localhost:${PORT}/health`
      );
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.error("Please make sure MongoDB is running on localhost:27017");
    process.exit(1);
  });
