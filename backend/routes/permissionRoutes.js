import express from 'express';
import {
  getSupervisorPermissions,
  getMyPermissions,
  updateSupervisorPermissions,
  getAllSupervisorsPermissions,
  deleteSupervisor,
} from '../controllers/permissionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all supervisors with permissions (Admin only)
router.get('/', protect, authorize('admin'), getAllSupervisorsPermissions);

// Get current supervisor's permissions
router.get('/me', protect, getMyPermissions);

// Get permissions for specific supervisor (Admin only)
router.get('/:supervisorId', protect, authorize('admin'), getSupervisorPermissions);

// Update permissions for supervisor (Admin only)
router.put('/:supervisorId', protect, authorize('admin'), updateSupervisorPermissions);

// Delete supervisor (Admin only)
router.delete('/:supervisorId', protect, authorize('admin'), deleteSupervisor);

export default router;

