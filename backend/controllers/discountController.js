import Discount from '../models/Discount.js';

// @desc    Get all discounts
// @route   GET /api/discounts
// @access  Public (for frontend display)
export const getDiscounts = async (req, res, next) => {
  try {
    const { targetType, activeOnly } = req.query;

    const query = {};

    if (targetType && targetType !== 'all') {
      query.targetType = { $in: [targetType, 'all'] };
    }

    if (activeOnly === 'true') {
      const now = new Date();
      query.isActive = true;
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    }

    const discounts = await Discount.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: discounts.length,
      data: discounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single discount
// @route   GET /api/discounts/:id
// @access  Public
export const getDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'الخصم غير موجود',
      });
    }

    res.json({
      success: true,
      data: discount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create discount
// @route   POST /api/discounts
// @access  Private (Admin only)
export const createDiscount = async (req, res, next) => {
  try {
    const discountData = {
      ...req.body,
      createdBy: req.user._id,
    };

    // Validate dates
    if (new Date(discountData.startDate) >= new Date(discountData.endDate)) {
      return res.status(400).json({
        success: false,
        message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء',
      });
    }

    // Validate discount value
    if (discountData.discountType === 'percentage' && discountData.discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: 'نسبة الخصم لا يمكن أن تكون أكثر من 100%',
      });
    }

    const discount = await Discount.create(discountData);

    res.status(201).json({
      success: true,
      data: discount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update discount
// @route   PUT /api/discounts/:id
// @access  Private (Admin only)
export const updateDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'الخصم غير موجود',
      });
    }

    // Validate dates if provided
    const startDate = req.body.startDate ? new Date(req.body.startDate) : discount.startDate;
    const endDate = req.body.endDate ? new Date(req.body.endDate) : discount.endDate;

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء',
      });
    }

    // Validate discount value if provided
    if (req.body.discountType === 'percentage' && req.body.discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: 'نسبة الخصم لا يمكن أن تكون أكثر من 100%',
      });
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: updatedDiscount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete discount
// @route   DELETE /api/discounts/:id
// @access  Private (Admin only)
export const deleteDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'الخصم غير موجود',
      });
    }

    await discount.deleteOne();

    res.json({
      success: true,
      message: 'تم حذف الخصم بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active discounts for a specific target type
// @route   GET /api/discounts/active/:targetType
// @access  Public
export const getActiveDiscounts = async (req, res, next) => {
  try {
    const { targetType } = req.params;
    const now = new Date();

    const discounts = await Discount.find({
      isActive: true,
      targetType: { $in: [targetType, 'all'] },
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { maxUses: null },
        { $expr: { $lt: ['$currentUses', '$maxUses'] } },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: discounts.length,
      data: discounts,
    });
  } catch (error) {
    next(error);
  }
};

