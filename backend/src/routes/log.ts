import { Router } from "express";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import Log from "../models/Log";

const router = Router();

// GET /api/logs
router.get("/", async (_req, res) => {
  try {
    const logs = await (Log as any).find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
