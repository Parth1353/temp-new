import { Router } from "express";
import Patient from "../models/Patient";
import { addLog } from "../Logger";

const router = Router();

// POST /api/patient
router.post("/", async (req, res) => {
  try {
    const { name, severity, requestedBeds } = req.body;

    // Validate input
    if (!name || !severity || !requestedBeds) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "severity", "requestedBeds"],
      });
    }

    if (severity < 1 || severity > 10) {
      return res.status(400).json({
        error: "Severity must be between 1 and 10",
      });
    }

    if (requestedBeds < 1) {
      return res.status(400).json({
        error: "Requested beds must be at least 1",
      });
    }

    const patient = await Patient.create({
      name,
      severity,
      requestedBeds,
      status: "waiting",
    });

    await addLog(
      "REQUEST",
      name,
      `Requested ${requestedBeds} beds with severity ${severity}`
    );

    console.log(
      `✅ Patient admitted: ${name} (severity: ${severity}, beds: ${requestedBeds})`
    );
    res.status(201).json(patient);
  } catch (err) {
    console.error("❌ Error admitting patient:", err);
    res.status(500).json({
      error: "Failed to admit patient",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// GET /api/patients
router.get("/", async (_req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error("❌ Error fetching patients:", err);
    res.status(500).json({
      error: "Failed to fetch patients",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// DELETE /api/patient/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Patient.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting patient:", err);
    res.status(500).json({ error: "Failed to delete patient" });
  }
});

export default router;
