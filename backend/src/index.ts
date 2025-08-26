import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// import patientRoutes from "./routes/patient.js";
// import allocateRoutes from "./routes/allocate.js";
// import resourceRoutes from "./routes/resource.js";
// import logRoutes from "./routes/log.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/hospital_bed_alloc";

// API routes
// app.use("/api/patient", patientRoutes);
// app.use("/api/allocate", allocateRoutes);
// app.use("/api/resources", resourceRoutes);
// app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
  res.send("Hospital Bed Allocation System Backend");
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
