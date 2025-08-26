import { Router } from "express";
import Patient from "../models/Patient";
import { addLog } from "../Logger";

const router = Router();

// POST /api/patient
router.post("/", async (req, res) => {
  try {
    const { name, severity, requestedBeds } = req.body;
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
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: "Failed to admit patient" });
  }
});

// GET /api/patients
router.get("/", async (_req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

export default router;
