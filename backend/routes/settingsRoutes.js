import express from 'express';
import {
  getSettings,
  updateSettings,
  updateUserPassword,
  getUsers,
  getTimezones,
} from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use((req, res, next) => {
  console.log('🔐 Settings route - protect middleware called');
  console.log('🔐 Path:', req.path);
  console.log('🔐 Method:', req.method);
  console.log('🔐 Has Authorization header:', !!req.headers.authorization);
  next();
}, protect);

// Get timezones (available to all authenticated users)
router.get('/timezones', getTimezones);

// Admin only routes
router.get('/', authorize('admin'), getSettings);
router.put('/', authorize('admin'), updateSettings);
router.get('/users', authorize('admin'), (req, res, next) => {
  console.log('🔍 GET /api/settings/users route hit');
  console.log('🔍 User:', req.user?.email, 'Role:', req.user?.role);
  next();
}, getUsers);
router.put('/users/:id/password', authorize('admin'), updateUserPassword);

export default router;

