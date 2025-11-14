import express from 'express';
import {
  getDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getActiveDiscounts,
} from '../controllers/discountController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/active/:targetType', getActiveDiscounts);
router.get('/', getDiscounts);
router.get('/:id', getDiscount);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createDiscount);
router.put('/:id', protect, authorize('admin'), updateDiscount);
router.delete('/:id', protect, authorize('admin'), deleteDiscount);

export default router;

