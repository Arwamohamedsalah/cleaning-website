import Housemaid from '../models/Housemaid.js';
import { compressBase64Images } from '../utils/imageCompression.js';

// @desc    Get all housemaids
// @route   GET /api/housemaids
// @access  Public
export const getHousemaids = async (req, res, next) => {
  try {
    const {
      status,
      nationality,
      skills,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (nationality && nationality !== 'all') {
      query.nationality = nationality;
    }

    if (skills) {
      query.skills = { $in: Array.isArray(skills) ? skills : [skills] };
    }

    if (search) {
      query.$or = [
        { arabicName: { $regex: search, $options: 'i' } },
        { englishName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const housemaids = await Housemaid.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Housemaid.countDocuments(query);

    console.log(`📊 Found ${total} housemaids in collection 'housemaids'`);

    res.json({
      success: true,
      count: housemaids.length,
      total,
      data: housemaids,
    });
  } catch (error) {
    console.error('❌ Error fetching housemaids:', error.message);
    next(error);
  }
};

// @desc    Get single housemaid
// @route   GET /api/housemaids/:id
// @access  Public
export const getHousemaid = async (req, res, next) => {
  try {
    const housemaid = await Housemaid.findById(req.params.id);

    if (!housemaid) {
      return res.status(404).json({ message: 'المساعدة غير موجودة' });
    }

    res.json({
      success: true,
      data: housemaid,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create housemaid
// @route   POST /api/housemaids
// @access  Private
export const createHousemaid = async (req, res, next) => {
  try {
    console.log('📝 Creating housemaid with data:', {
      name: req.body.name || req.body.arabicName,
      photosCount: req.body.photos ? req.body.photos.length : 0,
    });
    
    // Compress images if provided
    if (req.body.photos && Array.isArray(req.body.photos) && req.body.photos.length > 0) {
      console.log('🖼️ Compressing images...');
      req.body.photos = await compressBase64Images(req.body.photos);
      console.log('✅ Images compressed successfully');
    }
    
    const housemaid = await Housemaid.create(req.body);
    console.log('✅ Housemaid created successfully:', {
      id: housemaid._id,
      name: housemaid.arabicName || housemaid.name,
      photosCount: housemaid.photos ? housemaid.photos.length : 0,
    });

    res.status(201).json({
      success: true,
      data: housemaid,
    });
  } catch (error) {
    console.error('❌ Error creating housemaid:', error.message);
    next(error);
  }
};

// @desc    Update housemaid
// @route   PUT /api/housemaids/:id
// @access  Private
export const updateHousemaid = async (req, res, next) => {
  try {
    console.log('📝 Updating housemaid:', {
      id: req.params.id,
      photosCount: req.body.photos ? req.body.photos.length : 'not provided',
    });
    
    // Compress images if provided
    if (req.body.photos && Array.isArray(req.body.photos) && req.body.photos.length > 0) {
      console.log('🖼️ Compressing images...');
      req.body.photos = await compressBase64Images(req.body.photos);
      console.log('✅ Images compressed successfully');
    }
    
    const housemaid = await Housemaid.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!housemaid) {
      return res.status(404).json({ message: 'المساعدة غير موجودة' });
    }

    console.log('✅ Housemaid updated successfully:', {
      id: housemaid._id,
      photosCount: housemaid.photos ? housemaid.photos.length : 0,
    });

    res.json({
      success: true,
      data: housemaid,
    });
  } catch (error) {
    console.error('❌ Error updating housemaid:', error.message);
    next(error);
  }
};

// @desc    Delete housemaid
// @route   DELETE /api/housemaids/:id
// @access  Private
export const deleteHousemaid = async (req, res, next) => {
  try {
    const housemaid = await Housemaid.findById(req.params.id);

    if (!housemaid) {
      return res.status(404).json({ message: 'المساعدة غير موجودة' });
    }

    await housemaid.deleteOne();

    res.json({
      success: true,
      message: 'تم حذف المساعدة بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

