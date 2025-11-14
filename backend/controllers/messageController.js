import Message from '../models/Message.js';

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const {
      read,
      replied,
      archived,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (read !== undefined) {
      query.read = read === 'true';
    }

    if (replied !== undefined) {
      query.replied = replied === 'true';
    }

    if (archived !== undefined) {
      query.archived = archived === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find(query)
      .populate('repliedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      count: messages.length,
      total,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private
export const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('repliedBy', 'name email');

    if (!message) {
      return res.status(404).json({ message: 'الرسالة غير موجودة' });
    }

    // Mark as read
    if (!message.read) {
      message.read = true;
      await message.save();
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);

    // Send WhatsApp message to company when contact message is created
    try {
      const { sendContactMessageViaWhatsApp } = await import('../services/whatsappService.js');
      const result = await sendContactMessageViaWhatsApp(message);
      if (!result.success) {
        console.error('❌ فشل إرسال واتساب عند إنشاء رسالة التواصل:', result.error);
      }
    } catch (whatsappError) {
      console.error('❌ خطأ في إرسال واتساب عند إنشاء رسالة التواصل:', whatsappError);
      // Continue even if WhatsApp fails
    }

    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message
// @route   PUT /api/messages/:id
// @access  Private
export const updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!message) {
      return res.status(404).json({ message: 'الرسالة غير موجودة' });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to message
// @route   POST /api/messages/:id/reply
// @access  Private
export const replyMessage = async (req, res, next) => {
  try {
    const { replyMessage } = req.body;

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'الرسالة غير موجودة' });
    }

    message.replyMessage = replyMessage;
    message.replied = true;
    message.repliedBy = req.user._id;
    message.repliedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'تم إرسال الرد بنجاح',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'الرسالة غير موجودة' });
    }

    await message.deleteOne();

    res.json({
      success: true,
      message: 'تم حذف الرسالة بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

