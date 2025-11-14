import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Application from '../models/Application.js';
import Worker from '../models/Worker.js';
import { sendWorkerDetailsViaWhatsApp } from '../services/whatsappService.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
  try {
    const {
      status,
      serviceType,
      dateFrom,
      dateTo,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (serviceType && serviceType !== 'all') {
      query.serviceType = serviceType;
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('customer', 'name phone email')
      .populate('selectedWorkerId', 'arabicName phone status contractType skills experience')
      .populate('selectedHousemaidId', 'arabicName phone status contractType skills experience')
      .populate('assignedWorkers', 'arabicName phone status')
      .populate('assignedHousemaids', 'arabicName phone status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email address')
      .populate('selectedWorkerId', 'arabicName phone status contractType skills experience nationality age')
      .populate('selectedHousemaidId', 'arabicName phone status contractType skills experience nationality age')
      .populate('assignedWorkers', 'arabicName phone status')
      .populate('assignedHousemaids', 'arabicName phone status');

    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    console.log('📥 Received order request:', {
      fullName: req.body.fullName,
      phone: req.body.phone,
      workers: req.body.workers,
      date: req.body.date,
      address: req.body.address,
      serviceType: req.body.serviceType,
      amount: req.body.amount,
    });

    // Find or create customer
    let customer = await Customer.findOne({ phone: req.body.phone });

    if (!customer) {
      customer = await Customer.create({
        name: req.body.fullName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        district: req.body.district,
      });
    } else {
      // Update customer info if provided
      if (req.body.email) customer.email = req.body.email;
      if (req.body.address) customer.address = req.body.address;
      await customer.save();
    }

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    // Create order - make sure orderNumber is set and not overwritten
    const orderData = {
      ...req.body,
      customer: customer._id,
    };
    
    // Convert date string to Date object if needed
    if (orderData.date && typeof orderData.date === 'string') {
      orderData.date = new Date(orderData.date);
    }
    
    // Always set orderNumber FIRST (override if exists in req.body)
    orderData.orderNumber = orderNumber;
    
    // Verify orderNumber is set
    if (!orderData.orderNumber) {
      console.error('❌ ERROR: orderNumber is missing!');
      return res.status(400).json({
        success: false,
        message: 'فشل إنشاء رقم الطلب',
      });
    }
    
    // If selectedWorkerId is provided, add it to order
    if (req.body.selectedWorkerId) {
      orderData.selectedWorkerId = req.body.selectedWorkerId;
    }
    
    // If selectedHousemaidId is provided, add it to order
    if (req.body.selectedHousemaidId) {
      orderData.selectedHousemaidId = req.body.selectedHousemaidId;
    }
    
    // Add service category and country if provided
    if (req.body.serviceCategory) {
      orderData.serviceCategory = req.body.serviceCategory;
    }
    if (req.body.selectedCountry) {
      orderData.selectedCountry = req.body.selectedCountry;
    }
    
    // Debug: Log orderData to verify orderNumber is set
    console.log('📦 Creating order with orderNumber:', orderData.orderNumber);
    console.log('📦 Order data keys:', Object.keys(orderData));
    
    // Use new Order() instead of Order.create() to ensure hooks run
    const order = new Order(orderData);
    
    // Double check orderNumber before saving
    if (!order.orderNumber) {
      order.orderNumber = orderNumber;
      console.log('⚠️  orderNumber was missing, setting it now:', order.orderNumber);
    }
    
    await order.save();

    console.log('✅ Order created successfully:', {
      orderNumber: order.orderNumber,
      id: order._id,
      customer: customer.name,
      status: order.status,
    });

    // Update customer stats
    customer.totalOrders += 1;
    customer.lastOrderDate = new Date();
    await customer.save();

    // Send WhatsApp message to customer with order details
    try {
      const { sendOrderConfirmationViaWhatsApp } = await import('../services/whatsappService.js');
      const result = await sendOrderConfirmationViaWhatsApp(order);
      if (!result.success) {
        console.error('❌ فشل إرسال واتساب عند إنشاء الطلب:', result.error);
      }
    } catch (whatsappError) {
      console.error('❌ خطأ في إرسال واتساب عند إنشاء الطلب:', whatsappError);
      console.error('تفاصيل الخطأ:', whatsappError.message);
      // Continue even if WhatsApp fails
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('selectedWorkerId', 'arabicName phone status contractType skills experience');

    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    // If status is being changed to 'confirmed', send WhatsApp
    if (req.body.status === 'confirmed' && order.status !== 'confirmed') {
      if (!order.whatsappSent) {
        try {
          const { sendWorkerDetailsViaWhatsApp, sendOrderAcceptanceViaWhatsApp } = await import('../services/whatsappService.js');
          
          // If there's a selected worker, send details with worker info
          if (order.selectedWorkerId) {
            const worker = await Worker.findById(order.selectedWorkerId);
            if (worker) {
              const whatsappResult = await sendWorkerDetailsViaWhatsApp(order, worker);
              if (whatsappResult.success) {
                order.whatsappSent = true;
              }
            } else {
              // If worker not found, send acceptance message without worker details
              const whatsappResult = await sendOrderAcceptanceViaWhatsApp(order);
              if (whatsappResult.success) {
                order.whatsappSent = true;
              }
            }
          } else {
            // If no worker assigned, send acceptance message without worker details
            const whatsappResult = await sendOrderAcceptanceViaWhatsApp(order);
            if (whatsappResult.success) {
              order.whatsappSent = true;
            }
          }
        } catch (whatsappError) {
          console.error('❌ خطأ في إرسال واتساب:', whatsappError);
          console.error('تفاصيل الخطأ:', whatsappError.message);
          // Continue with order update even if WhatsApp fails
        }
      }
    }

    // Update order
    Object.assign(order, req.body);
    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm order and send WhatsApp
// @route   POST /api/orders/:id/confirm
// @access  Private
export const confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('selectedWorkerId', 'arabicName phone status contractType skills experience nationality age')
      .populate('assignedWorkers', 'arabicName phone status contractType skills experience');

    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    // Update order status to confirmed
    order.status = 'confirmed';
    
    // Send WhatsApp message when order is confirmed
    if (!order.whatsappSent) {
      try {
        const { sendWorkerDetailsViaWhatsApp, sendOrderAcceptanceViaWhatsApp } = await import('../services/whatsappService.js');
        
        // If there's a selected worker or assigned workers, send details
        if (order.selectedWorkerId) {
          const worker = await Worker.findById(order.selectedWorkerId);
          if (worker) {
            // Add worker to assignedWorkers if not already there
            if (!order.assignedWorkers.includes(order.selectedWorkerId)) {
              order.assignedWorkers.push(order.selectedWorkerId);
            }

            // Send WhatsApp message with worker details
            const whatsappResult = await sendWorkerDetailsViaWhatsApp(order, worker);
            if (whatsappResult.success) {
              order.whatsappSent = true;
            } else {
              console.error('WhatsApp sending failed:', whatsappResult.error);
            }
          } else {
            // If worker not found, send acceptance message without worker details
            const whatsappResult = await sendOrderAcceptanceViaWhatsApp(order);
            if (whatsappResult.success) {
              order.whatsappSent = true;
            } else {
              console.error('WhatsApp sending failed:', whatsappResult.error);
            }
          }
        } else if (order.assignedWorkers && order.assignedWorkers.length > 0) {
          // If there are assigned workers, use the first one
          const worker = order.assignedWorkers[0];
          if (worker) {
            const whatsappResult = await sendWorkerDetailsViaWhatsApp(order, worker);
            if (whatsappResult.success) {
              order.whatsappSent = true;
            } else {
              console.error('WhatsApp sending failed:', whatsappResult.error);
            }
          }
        } else {
          // If no worker assigned, send acceptance message without worker details
          const whatsappResult = await sendOrderAcceptanceViaWhatsApp(order);
          if (whatsappResult.success) {
            order.whatsappSent = true;
          } else {
            console.error('WhatsApp sending failed:', whatsappResult.error);
          }
        }
      } catch (whatsappError) {
        console.error('❌ خطأ في إرسال واتساب عند التأكيد:', whatsappError);
        console.error('تفاصيل الخطأ:', whatsappError.message);
        // Continue even if WhatsApp fails
      }
    }

    await order.save();

    res.json({
      success: true,
      data: order,
      whatsappSent: order.whatsappSent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: 'تم حذف الطلب بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create inquiry (creates customer and order automatically)
// @route   POST /api/orders/inquiry
// @access  Public
export const createInquiry = async (req, res, next) => {
  try {
    console.log('📥 Received inquiry request:', {
      name: req.body.name,
      phone: req.body.phone,
      inquiryType: req.body.inquiryType, // 'contract' or 'booking'
      workerId: req.body.workerId,
      housemaidId: req.body.housemaidId,
      notes: req.body.notes,
    });

    // Find or create customer
    let customer = await Customer.findOne({ phone: req.body.phone });

    if (!customer) {
      customer = await Customer.create({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email || '',
        address: req.body.address || '',
        city: req.body.city || null,
        district: req.body.district || '',
      });
      console.log('✅ Created new customer:', customer._id);
    } else {
      // Update customer info if provided
      if (req.body.email) customer.email = req.body.email;
      if (req.body.address) customer.address = req.body.address;
      if (req.body.city) customer.city = req.body.city;
      if (req.body.district) customer.district = req.body.district;
      await customer.save();
      console.log('✅ Updated existing customer:', customer._id);
    }

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `INQ-${Date.now()}-${orderCount + 1}`;

    // Create inquiry order
    const orderData = {
      orderNumber: orderNumber,
      customer: customer._id,
      fullName: req.body.name,
      phone: req.body.phone,
      email: req.body.email || '',
      address: req.body.address || '',
      city: req.body.city || null,
      district: req.body.district || '',
      serviceType: 'normal', // Default service type for inquiries
      rooms: 1,
      workers: 1,
      date: new Date(), // Default to today
      time: '09:00', // Default time
      status: 'pending',
      amount: 0, // Inquiry has no amount yet
      notes: req.body.notes || `استفسار عن ${req.body.inquiryType === 'contract' ? 'عقد' : 'حجز'}`,
      inquiryType: req.body.inquiryType || 'general', // 'contract', 'booking', 'general'
    };

    // Add worker/housemaid reference if provided
    if (req.body.workerId) {
      orderData.selectedWorkerId = req.body.workerId;
    }
    if (req.body.housemaidId) {
      orderData.selectedHousemaidId = req.body.housemaidId;
    }

    const order = await Order.create(orderData);
    console.log('✅ Created inquiry order:', order._id, order.orderNumber);

    res.status(201).json({
      success: true,
      message: 'تم إرسال الاستفسار بنجاح',
      data: {
        order: order,
        customer: customer,
      },
    });
  } catch (error) {
    console.error('❌ Error creating inquiry:', error);
    next(error);
  }
};

