import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  
  console.log('🔒 Protect middleware - Path:', req.path);
  console.log('🔒 Protect middleware - Authorization header:', req.headers.authorization ? 'Present' : 'Missing');

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'المستخدم غير موجود' 
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ 
          success: false,
          message: 'تم تعطيل حسابك' 
        });
      }

      next();
    } catch (error) {
      console.error('❌ Protect middleware error:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'غير مصرح، الرجاء تسجيل الدخول' 
      });
    }
  } else {
    return res.status(401).json({ 
      success: false,
      message: 'غير مصرح، لا يوجد token' 
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'غير مصرح، الرجاء تسجيل الدخول' 
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: `المستخدم بصلاحية ${req.user.role} غير مصرح له بالوصول لهذا المسار` 
      });
    }
    next();
  };
};

