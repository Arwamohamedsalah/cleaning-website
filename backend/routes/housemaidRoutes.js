import express from 'express';
import {
  getHousemaids,
  getHousemaid,
  createHousemaid,
  updateHousemaid,
  deleteHousemaid,
} from '../controllers/housemaidController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getHousemaids) // Public - allow viewing housemaids without authentication
  .post(protect, createHousemaid);

router.route('/:id')
  .get(getHousemaid) // Public - allow viewing housemaid details without authentication
  .put(protect, updateHousemaid)
  .delete(protect, deleteHousemaid);

export default router;

