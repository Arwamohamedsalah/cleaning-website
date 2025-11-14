import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    unique: true,
    required: true,
  },
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
    trim: true,
  },
  idNumber: {
    type: String,
    required: [true, 'رقم الهوية مطلوب'],
    unique: true,
    trim: true,
  },
  birthDate: {
    type: Date,
    required: [true, 'تاريخ الميلاد مطلوب'],
  },
  experience: {
    type: Number,
    default: 0,
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
    enum: ['monthly', 'daily', 'hourly'],
    default: 'monthly',
  },
  photos: [{
    type: String,
  }],
  idPhoto: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['under-review', 'accepted', 'rejected'],
    default: 'under-review',
  },
  notes: {
    type: String,
    default: '',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Generate application number before saving
applicationSchema.pre('save', async function(next) {
  if (!this.applicationNumber) {
    const count = await mongoose.model('Application').countDocuments();
    this.applicationNumber = `APP-${Date.now()}-${count + 1}`;
  }
  next();
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;

