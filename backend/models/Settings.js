import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // General Settings
  general: {
    siteName: {
      type: String,
      default: 'خدمات التنظيف',
    },
    siteLanguage: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar',
    },
    timezone: {
      type: String,
      default: 'Asia/Riyadh',
    },
    dateFormat: {
      type: String,
      default: 'dd/mm/yyyy',
    },
    currency: {
      type: String,
      default: 'SAR',
    },
  },
  // Company Settings
  company: {
    name: {
      type: String,
      default: 'شركة خدمات التنظيف المميزة',
    },
    email: {
      type: String,
      default: 'info@cleaning.com',
    },
    phone: {
      type: String,
      default: '0501234567',
    },
    address: {
      type: String,
      default: 'الرياض، المملكة العربية السعودية',
    },
    taxNumber: {
      type: String,
      default: '',
    },
    commercialRegister: {
      type: String,
      default: '',
    },
  },
  // WhatsApp Settings
  whatsapp: {
    apiKey: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '966501234567',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    autoReply: {
      type: Boolean,
      default: true,
    },
    replyMessage: {
      type: String,
      default: 'شكراً لتواصلك معنا، سنرد عليك قريباً',
    },
  },
  // Appearance Settings
  appearance: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark',
    },
    primaryColor: {
      type: String,
      default: 'rgba(37, 150, 190, 1)',
    },
    sidebarWidth: {
      type: Number,
      default: 280,
    },
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;

