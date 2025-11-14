import Settings from '../models/Settings.js';
import User from '../models/User.js';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private (Admin only)
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإعدادات',
      error: error.message,
    });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private (Admin only)
export const updateSettings = async (req, res) => {
  try {
    const { general, company, whatsapp, appearance } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    if (general) {
      settings.general = { ...settings.general, ...general };
    }
    if (company) {
      settings.company = { ...settings.company, ...company };
    }
    if (whatsapp) {
      settings.whatsapp = { ...settings.whatsapp, ...whatsapp };
    }
    if (appearance) {
      settings.appearance = { ...settings.appearance, ...appearance };
    }

    await settings.save();

    res.json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
      data: settings,
    });
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الإعدادات',
      error: error.message,
    });
  }
};

// @desc    Update user password (Admin only)
// @route   PUT /api/settings/users/:id/password
// @access  Private (Admin only)
export const updateUserPassword = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { newPassword } = req.body;

    console.log('🔐 updateUserPassword called:', { userId, passwordLength: newPassword?.length });

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      });
    }

    // Find user and select password field (normally excluded)
    const user = await User.findById(userId).select('+password');
    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    console.log('✅ User found:', { id: user._id, email: user.email, name: user.name });

    // Set the new password (will be hashed by pre('save') hook)
    user.password = newPassword;
    await user.save();

    console.log('✅ Password updated successfully for user:', user.email);

    res.json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح',
    });
  } catch (error) {
    console.error('❌ Error updating user password:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث كلمة المرور',
      error: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/settings/users
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    console.log('📋 getUsers called - User:', req.user?.email, 'Role:', req.user?.role);
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    console.log('✅ Found users:', users.length);
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المستخدمين',
      error: error.message,
    });
  }
};

// @desc    Get timezones list
// @route   GET /api/settings/timezones
// @access  Private
export const getTimezones = async (req, res) => {
  try {
    const timezones = [
      { value: 'Asia/Riyadh', label: 'الرياض (GMT+3)' },
      { value: 'Asia/Dubai', label: 'دبي (GMT+4)' },
      { value: 'Asia/Kuwait', label: 'الكويت (GMT+3)' },
      { value: 'Asia/Bahrain', label: 'البحرين (GMT+3)' },
      { value: 'Asia/Qatar', label: 'قطر (GMT+3)' },
      { value: 'Asia/Muscat', label: 'مسقط (GMT+4)' },
      { value: 'Africa/Cairo', label: 'القاهرة (GMT+2)' },
      { value: 'Africa/Casablanca', label: 'الدار البيضاء (GMT+1)' },
      { value: 'Europe/London', label: 'لندن (GMT+0)' },
      { value: 'Europe/Paris', label: 'باريس (GMT+1)' },
      { value: 'Europe/Berlin', label: 'برلين (GMT+1)' },
      { value: 'Europe/Rome', label: 'روما (GMT+1)' },
      { value: 'Europe/Madrid', label: 'مدريد (GMT+1)' },
      { value: 'America/New_York', label: 'نيويورك (GMT-5)' },
      { value: 'America/Chicago', label: 'شيكاغو (GMT-6)' },
      { value: 'America/Denver', label: 'دنفر (GMT-7)' },
      { value: 'America/Los_Angeles', label: 'لوس أنجلوس (GMT-8)' },
      { value: 'America/Toronto', label: 'تورنتو (GMT-5)' },
      { value: 'America/Mexico_City', label: 'مكسيكو سيتي (GMT-6)' },
      { value: 'America/Sao_Paulo', label: 'ساو باولو (GMT-3)' },
      { value: 'Asia/Tokyo', label: 'طوكيو (GMT+9)' },
      { value: 'Asia/Shanghai', label: 'شنغهاي (GMT+8)' },
      { value: 'Asia/Hong_Kong', label: 'هونغ كونغ (GMT+8)' },
      { value: 'Asia/Singapore', label: 'سنغافورة (GMT+8)' },
      { value: 'Asia/Bangkok', label: 'بانكوك (GMT+7)' },
      { value: 'Asia/Jakarta', label: 'جاكرتا (GMT+7)' },
      { value: 'Asia/Manila', label: 'مانيلا (GMT+8)' },
      { value: 'Asia/Kolkata', label: 'مومباي (GMT+5:30)' },
      { value: 'Asia/Karachi', label: 'كراتشي (GMT+5)' },
      { value: 'Asia/Dhaka', label: 'دكا (GMT+6)' },
      { value: 'Australia/Sydney', label: 'سيدني (GMT+10)' },
      { value: 'Australia/Melbourne', label: 'ملبورن (GMT+10)' },
      { value: 'Pacific/Auckland', label: 'أوكلاند (GMT+12)' },
    ];

    res.json({
      success: true,
      data: timezones,
    });
  } catch (error) {
    console.error('❌ Error fetching timezones:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المناطق الزمنية',
      error: error.message,
    });
  }
};

