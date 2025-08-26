import { Router } from "express";
import mongoose from "mongoose";
import Patient from "../models/Patient";
import Resource from "../models/Resource";
import { PriorityQueue } from "../PriorityQueue";
import { isSafeState } from "../Banker";
import { addLog } from "../Logger";

const router = Router();

// POST /api/allocate
router.post("/", async (_req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Fetch all waiting patients and ICU resource
    const patients = await Patient.find({ status: "waiting" }).session(session);
    const icu = await Resource.findOne({ name: "ICU_BED" }).session(session);
    if (!icu) throw new Error("ICU resource not found");

    // Build priority queue
    const pq = new PriorityQueue();
    patients.forEach((p) =>
      pq.enqueue({ severity: p.severity, patientId: (p._id as any).toString() })
    );

    let admitted = [];
    let rolledBack = [];
    let available = icu.totalUnits - icu.allocatedUnits;

    while (!pq.isEmpty()) {
      const item = pq.dequeue();
      if (!item) break;
      const patient = patients.find(
        (p) => (p._id as any).toString() === item.patientId
      );
      if (!patient) continue;
      // Banker's Algorithm check
      if (isSafeState(icu.allocatedUnits, patient.requestedBeds, available)) {
        // Safe: admit
        patient.status = "admitted";
        icu.allocatedUnits += patient.requestedBeds;
        available -= patient.requestedBeds;
        admitted.push(patient.name);
        await addLog(
          "ALLOCATE",
          patient.name,
          `Admitted with ${patient.requestedBeds} beds`
        );
        await patient.save({ session });
      } else {
        // Unsafe: rollback
        patient.status = "rolled_back";
        rolledBack.push(patient.name);
        await addLog(
          "ROLLBACK",
          patient.name,
          "Allocation unsafe, rolled back"
        );
        await patient.save({ session });
      }
    }
    await icu.save({ session });
    await session.commitTransaction();
    res.json({ admitted, rolledBack });
  } catch (err) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ error: "Allocation failed", details: (err as Error).message });
  } finally {
    session.endSession();
  }
});

export default router;
