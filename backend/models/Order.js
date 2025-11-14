import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  fullName: {
    type: String,
    required: [true, 'الاسم الكامل مطلوب'],
  },
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  serviceType: {
    type: String,
    enum: ['comprehensive', 'normal', 'quick', 'deep'],
    required: [true, 'نوع الخدمة مطلوب'],
  },
  rooms: {
    type: Number,
    default: 1,
    min: 1,
  },
  workers: {
    type: Number,
    default: 1,
    min: 1,
  },
  date: {
    type: Date,
    required: [true, 'تاريخ الخدمة مطلوب'],
  },
  time: {
    type: String,
    required: [true, 'وقت الخدمة مطلوب'],
  },
  address: {
    type: String,
    required: [true, 'العنوان مطلوب'],
  },
  city: {
    type: String,
    enum: ['riyadh', 'jeddah', 'dammam', 'khobar', 'other'],
    default: null,
  },
  district: {
    type: String,
    default: '',
  },
  apartment: {
    type: String,
    default: '',
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  amount: {
    type: Number,
    required: [true, 'المبلغ مطلوب'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'done', 'cancelled'],
    default: 'pending',
  },
  notes: {
    type: String,
    default: '',
  },
  selectedWorkerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    default: null,
  },
  selectedHousemaidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Housemaid',
    default: null,
  },
  serviceCategory: {
    type: String,
    enum: ['worker', 'housemaid'],
    default: null,
  },
  selectedCountry: {
    type: String,
    default: null,
  },
  assignedWorkers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
  }],
  assignedHousemaids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Housemaid',
  }],
  completedAt: {
    type: Date,
    default: null,
  },
  whatsappSent: {
    type: Boolean,
    default: false,
  },
  inquiryType: {
    type: String,
    enum: ['contract', 'booking', 'general'],
    default: null,
  },
}, {
  timestamps: true,
});

// Generate order number before validation
orderSchema.pre('validate', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

// Also keep the save hook as backup
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

