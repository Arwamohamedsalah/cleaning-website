import Worker from '../models/Worker.js';
import { compressBase64Images } from '../utils/imageCompression.js';

// @desc    Get all workers
// @route   GET /api/workers
// @access  Private
export const getWorkers = async (req, res, next) => {
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

    const workers = await Worker.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Worker.countDocuments(query);

    res.json({
      success: true,
      count: workers.length,
      total: total,
      data: workers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Private
export const getWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ message: 'العاملة غير موجودة' });
    }

    res.json({
      success: true,
      data: worker,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create worker
// @route   POST /api/workers
// @access  Private
export const createWorker = async (req, res, next) => {
  try {
    console.log('📝 Creating worker with data:', {
      name: req.body.name || req.body.arabicName,
      photosCount: req.body.photos ? req.body.photos.length : 0,
    });
    
    // Compress images if provided
    if (req.body.photos && Array.isArray(req.body.photos) && req.body.photos.length > 0) {
      console.log('🖼️ Compressing images...');
      req.body.photos = await compressBase64Images(req.body.photos);
      console.log('✅ Images compressed successfully');
    }
    
    const worker = await Worker.create(req.body);
    console.log('✅ Worker created successfully:', {
      id: worker._id,
      name: worker.arabicName || worker.name,
      photosCount: worker.photos ? worker.photos.length : 0,
    });

    res.status(201).json({
      success: true,
      data: worker,
    });
  } catch (error) {
    console.error('❌ Error creating worker:', error.message);
    next(error);
  }
};

// @desc    Update worker
// @route   PUT /api/workers/:id
// @access  Private
export const updateWorker = async (req, res, next) => {
  try {
    console.log('📝 Updating worker:', {
      id: req.params.id,
      photosCount: req.body.photos ? req.body.photos.length : 'not provided',
    });
    
    // Compress images if provided
    if (req.body.photos && Array.isArray(req.body.photos) && req.body.photos.length > 0) {
      console.log('🖼️ Compressing images...');
      req.body.photos = await compressBase64Images(req.body.photos);
      console.log('✅ Images compressed successfully');
    }
    
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!worker) {
      return res.status(404).json({ message: 'العاملة غير موجودة' });
    }

    console.log('✅ Worker updated successfully:', {
      id: worker._id,
      photosCount: worker.photos ? worker.photos.length : 0,
    });

    res.json({
      success: true,
      data: worker,
    });
  } catch (error) {
    console.error('❌ Error updating worker:', error.message);
    next(error);
  }
};

// @desc    Delete worker
// @route   DELETE /api/workers/:id
// @access  Private
export const deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ message: 'العاملة غير موجودة' });
    }

    await worker.deleteOne();

    res.json({
      success: true,
      message: 'تم حذف العاملة بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

