import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف المشرف مطلوب'],
  },
  permissions: {
    overview: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: Boolean,
      default: false,
    },
    customers: {
      type: Boolean,
      default: false,
    },
    workers: {
      type: Boolean,
      default: false,
    },
    assistants: {
      type: Boolean,
      default: false,
    },
    messages: {
      type: Boolean,
      default: false,
    },
    reports: {
      type: Boolean,
      default: false,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Ensure one permission document per supervisor (unique index)
permissionSchema.index({ supervisorId: 1 }, { unique: true });

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;

