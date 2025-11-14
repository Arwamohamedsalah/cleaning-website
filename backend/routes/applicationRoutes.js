import express from 'express';
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  acceptApplication,
  rejectApplication,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getApplications)
  .post(createApplication);

router.route('/:id')
  .get(protect, getApplication)
  .put(protect, updateApplication)
  .delete(protect, deleteApplication);

router.post('/:id/accept', protect, acceptApplication);
router.post('/:id/reject', protect, rejectApplication);

export default router;

