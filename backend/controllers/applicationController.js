import Application from '../models/Application.js';
import Worker from '../models/Worker.js';
import { sendApplicationConfirmationViaWhatsApp } from '../services/whatsappService.js';

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res, next) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { arabicName: { $regex: search, $options: 'i' } },
        { englishName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { idNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      count: applications.length,
      total,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'طلب التوظيف غير موجود' });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create application
// @route   POST /api/applications
// @access  Public
export const createApplication = async (req, res, next) => {
  try {
    const application = await Application.create(req.body);

    // Send WhatsApp message to company when application is created
    try {
      const result = await sendApplicationConfirmationViaWhatsApp(application);
      if (!result.success) {
        console.error('❌ فشل إرسال واتساب عند إنشاء طلب الاستقدام:', result.error);
      }
    } catch (whatsappError) {
      console.error('❌ خطأ في إرسال واتساب عند إنشاء طلب الاستقدام:', whatsappError);
      // Continue even if WhatsApp fails
    }

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({ message: 'طلب التوظيف غير موجود' });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept application (convert to worker)
// @route   POST /api/applications/:id/accept
// @access  Private
export const acceptApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'طلب التوظيف غير موجود' });
    }

    // Create worker from application
    const worker = await Worker.create({
      arabicName: application.arabicName,
      englishName: application.englishName,
      nationality: application.nationality,
      age: application.age,
      phone: application.phone,
      idNumber: application.idNumber,
      birthDate: application.birthDate,
      experience: application.experience,
      skills: application.skills,
      languages: application.languages,
      maritalStatus: application.maritalStatus,
      contractType: application.contractType,
      photos: application.photos,
      idPhoto: application.idPhoto,
      status: 'available',
    });

    // Update application status
    application.status = 'accepted';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    res.json({
      success: true,
      message: 'تم قبول الطلبية وإضافة العاملة بنجاح',
      data: {
        application,
        worker,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject application
// @route   POST /api/applications/:id/reject
// @access  Private
export const rejectApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'طلب التوظيف غير موجود' });
    }

    application.status = 'rejected';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    res.json({
      success: true,
      message: 'تم رفض الطلبية',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'طلب التوظيف غير موجود' });
    }

    await application.deleteOne();

    res.json({
      success: true,
      message: 'تم حذف الطلب بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

