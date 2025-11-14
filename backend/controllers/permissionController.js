import Permission from '../models/Permission.js';
import User from '../models/User.js';

// @desc    Get permissions for a supervisor
// @route   GET /api/permissions/:supervisorId
// @access  Private (Admin only)
export const getSupervisorPermissions = async (req, res, next) => {
  try {
    const { supervisorId } = req.params;

    // Check if supervisor exists and is actually a supervisor
    const supervisor = await User.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ 
        success: false,
        message: 'المشرف غير موجود' 
      });
    }

    if (supervisor.role !== 'supervisor') {
      return res.status(400).json({ 
        success: false,
        message: 'المستخدم المحدد ليس مشرفاً' 
      });
    }

    let permission = await Permission.findOne({ supervisorId }).populate('supervisorId', 'name email');

    // If no permission document exists, create one with default (all false)
    if (!permission) {
      permission = await Permission.create({
        supervisorId,
        permissions: {
          overview: false,
          orders: false,
          customers: false,
          workers: false,
          assistants: false,
          messages: false,
          reports: false,
        },
        createdBy: req.user._id,
      });
      await permission.populate('supervisorId', 'name email');
    }

    res.json({
      success: true,
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current supervisor's permissions
// @route   GET /api/permissions/me
// @access  Private (Supervisor only)
export const getMyPermissions = async (req, res, next) => {
  try {
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ 
        success: false,
        message: 'غير مصرح - يجب أن تكون مشرفاً' 
      });
    }

    let permission = await Permission.findOne({ supervisorId: req.user._id });

    // If no permission document exists, return default (all false)
    if (!permission) {
      return res.json({
        success: true,
        data: {
          permissions: {
            overview: false,
            orders: false,
            customers: false,
            workers: false,
            assistants: false,
            messages: false,
            reports: false,
          },
        },
      });
    }

    res.json({
      success: true,
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update permissions for a supervisor
// @route   PUT /api/permissions/:supervisorId
// @access  Private (Admin only)
export const updateSupervisorPermissions = async (req, res, next) => {
  try {
    const { supervisorId } = req.params;
    const { permissions } = req.body;

    // Check if supervisor exists and is actually a supervisor
    const supervisor = await User.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ 
        success: false,
        message: 'المشرف غير موجود' 
      });
    }

    if (supervisor.role !== 'supervisor') {
      return res.status(400).json({ 
        success: false,
        message: 'المستخدم المحدد ليس مشرفاً' 
      });
    }

    // Find or create permission document
    let permission = await Permission.findOne({ supervisorId });

    if (permission) {
      // Update existing permissions
      permission.permissions = {
        ...permission.permissions,
        ...permissions,
      };
      permission.updatedBy = req.user._id;
      await permission.save();
    } else {
      // Create new permission document
      permission = await Permission.create({
        supervisorId,
        permissions: {
          overview: false,
          orders: false,
          customers: false,
          workers: false,
          assistants: false,
          messages: false,
          reports: false,
          ...permissions,
        },
        createdBy: req.user._id,
      });
    }

    await permission.populate('supervisorId', 'name email');

    res.json({
      success: true,
      message: 'تم تحديث الصلاحيات بنجاح',
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all supervisors with their permissions
// @route   GET /api/permissions
// @access  Private (Admin only)
export const getAllSupervisorsPermissions = async (req, res, next) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' })
      .select('name email phone role isActive createdAt')
      .sort({ createdAt: -1 });

    const supervisorsWithPermissions = await Promise.all(
      supervisors.map(async (supervisor) => {
        const permission = await Permission.findOne({ supervisorId: supervisor._id });
        return {
          ...supervisor.toObject(),
        permissions: permission ? permission.permissions : {
          overview: false,
          orders: false,
          customers: false,
          workers: false,
          assistants: false,
          messages: false,
          reports: false,
        },
        };
      })
    );

    res.json({
      success: true,
      data: supervisorsWithPermissions,
    });
  } catch (error) {
    next(error);
  }
};
