import express from 'express';
import {
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker,
} from '../controllers/workerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getWorkers) // Public - allow viewing workers without authentication
  .post(protect, createWorker);

router.route('/:id')
  .get(getWorker) // Public - allow viewing worker details without authentication
  .put(protect, updateWorker)
  .delete(protect, deleteWorker);

export default router;

