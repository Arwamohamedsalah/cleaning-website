import express from 'express';
import {
  getOrdersReport,
  getRevenueReport,
  getWorkersReport,
  getSatisfactionReport,
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/orders', protect, getOrdersReport);
router.get('/revenue', protect, getRevenueReport);
router.get('/workers', protect, getWorkersReport);
router.get('/satisfaction', protect, getSatisfactionReport);

export default router;

