import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  arabicName: {
    type: String,
    required: [true, 'الاسم بالعربي مطلوب'],
    trim: true,
  },
  englishName: {
    type: String,
    trim: true,
  },
  nationality: {
    type: String,
    required: [true, 'الجنسية مطلوبة'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'العمر مطلوب'],
    min: 18,
    max: 65,
  },
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    unique: true,
    trim: true,
  },
  idNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  birthDate: {
    type: Date,
    default: null,
  },
  experience: {
    type: Number,
    default: 0,
    min: 0,
  },
  price: {
    type: Number,
    default: null,
    min: 0,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  languages: [{
    type: String,
    trim: true,
  }],
  maritalStatus: {
    type: String,
    enum: ['متزوجة', 'عزباء', 'مطلقة', 'أرملة', ''],
    default: '',
  },
  contractType: {
    type: String,
    enum: ['monthly', 'yearly', 'daily', 'hourly'],
    default: 'monthly',
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'on-leave', 'inactive'],
    default: 'available',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  photos: [{
    type: String,
  }],
  idPhoto: {
    type: String,
    default: null,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  adminNotes: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;

