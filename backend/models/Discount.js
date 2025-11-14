import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان الخصم مطلوب'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'نوع الخصم مطلوب'],
  },
  discountValue: {
    type: Number,
    required: [true, 'قيمة الخصم مطلوبة'],
    min: 0,
  },
  // For percentage: 0-100, for fixed: amount in currency
  startDate: {
    type: Date,
    required: [true, 'تاريخ البدء مطلوب'],
  },
  endDate: {
    type: Date,
    required: [true, 'تاريخ الانتهاء مطلوب'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  targetType: {
    type: String,
    enum: ['assistants', 'workers', 'all'],
    default: 'assistants',
  },
  // Which type of service this discount applies to
  minContractDuration: {
    type: Number,
    default: null,
    // Minimum contract duration in months (for assistants)
  },
  maxUses: {
    type: Number,
    default: null,
    // Maximum number of times this discount can be used (null = unlimited)
  },
  currentUses: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  collection: 'cleaning', // Collection name as requested
});

// Index for active discounts
discountSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

// Method to check if discount is currently valid
discountSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (this.maxUses === null || this.currentUses < this.maxUses)
  );
};

// Method to apply discount
discountSchema.methods.applyDiscount = function(originalPrice) {
  if (!this.isValid()) {
    return { discountedPrice: originalPrice, discountAmount: 0 };
  }

  let discountAmount = 0;
  if (this.discountType === 'percentage') {
    discountAmount = (originalPrice * this.discountValue) / 100;
  } else {
    discountAmount = Math.min(this.discountValue, originalPrice);
  }

  const discountedPrice = Math.max(0, originalPrice - discountAmount);

  return {
    discountedPrice,
    discountAmount,
    originalPrice,
  };
};

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;

