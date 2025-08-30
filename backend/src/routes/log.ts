import { Router } from 'express';
import Log from '../models/Log';

const router = Router();

// GET /api/logs
router.get('/', async (_req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;
