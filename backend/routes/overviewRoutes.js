import express from 'express';
import { getOverview, getProfileStats } from '../controllers/overviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getOverview);
router.get('/profile-stats', protect, getProfileStats);

export default router;

