import { Router } from "express";
import Resource from "../models/Resource";

const router = Router();

// GET /api/resources
router.get("/", async (_req, res) => {
  try {
    const icu = await Resource.findOne({ name: "ICU_BED" });
    res.json(icu);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ICU resource" });
  }
});

export default router;
