import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

let whatsappClient = null;
let isInitialized = false;
let isReady = false;

/**
 * Initialize WhatsApp Client
 */
export const initializeWhatsApp = () => {
  if (isInitialized) {
    return whatsappClient;
  }

  try {
    whatsappClient = new Client({
      authStrategy: new LocalAuth({
        dataPath: './whatsapp-session'
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    // QR Code event
    whatsappClient.on('qr', (qr) => {
      console.log('📱 امسح رمز QR هذا باستخدام WhatsApp:');
      qrcode.generate(qr, { small: true });
      console.log('\nأو افتح WhatsApp على هاتفك واذهب إلى:');
      console.log('الإعدادات > الأجهزة المرتبطة > ربط جهاز');
    });

    // Ready event
    whatsappClient.on('ready', () => {
      console.log('✅ WhatsApp Client جاهز!');
      isReady = true;
    });

    // Authentication event
    whatsappClient.on('authenticated', () => {
      console.log('✅ تم المصادقة بنجاح!');
    });

    // Authentication failure
    whatsappClient.on('auth_failure', (msg) => {
      console.error('❌ فشل المصادقة:', msg);
      isReady = false;
    });

    // Disconnected
    whatsappClient.on('disconnected', (reason) => {
      console.log('⚠️ تم قطع الاتصال:', reason);
      isReady = false;
      isInitialized = false;
      whatsappClient = null;
    });

    // Initialize
    whatsappClient.initialize();
    isInitialized = true;

    return whatsappClient;
  } catch (error) {
    console.error('❌ خطأ في تهيئة WhatsApp Client:', error);
    return null;
  }
};

/**
 * Send WhatsApp message using whatsapp-web.js
 * @param {string} to - Phone number (with country code, e.g., 966501234567)
 * @param {string} message - Message text
 * @returns {Promise<Object>}
 */
export const sendWhatsAppMessage = async (to, message) => {
  try {
    // Initialize client if not already done
    if (!isInitialized || !whatsappClient) {
      whatsappClient = initializeWhatsApp();
    }

    // Wait for client to be ready (max 30 seconds)
    let attempts = 0;
    while (!isReady && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!isReady) {
      return {
        success: false,
        error: 'WhatsApp Client غير جاهز. يرجى مسح رمز QR أولاً.',
      };
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(to);
    const chatId = `${formattedPhone}@c.us`;

    console.log(`📤 محاولة إرسال رسالة واتساب إلى: ${formattedPhone}`);
    console.log(`📝 محتوى الرسالة: ${message.substring(0, 100)}...`);

    // Send message
    const result = await whatsappClient.sendMessage(chatId, message);

    console.log('✅ تم إرسال الرسالة بنجاح:', result.id._serialized);

    return {
      success: true,
      messageId: result.id._serialized,
      data: result,
    };
  } catch (error) {
    console.error('❌ خطأ في إرسال رسالة واتساب:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);

    // Log the message that failed to send
    console.log('📱 الرسالة التي فشل إرسالها:');
    console.log('─────────────────────────────────────');
    console.log(`إلى: ${to}`);
    console.log(`الرسالة:\n${message}`);
    console.log('─────────────────────────────────────');

    return {
      success: false,
      error: error.message || 'فشل إرسال رسالة واتساب',
    };
  }
};

/**
 * Format phone number for WhatsApp
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // If starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // If doesn't start with country code, assume Saudi Arabia (966)
  if (cleaned.length === 9) {
    cleaned = '966' + cleaned;
  }

  return cleaned;
};

/**
 * Get WhatsApp client status
 */
export const getWhatsAppStatus = () => {
  return {
    isInitialized,
    isReady,
    hasClient: !!whatsappClient,
  };
};

export default {
  initializeWhatsApp,
  sendWhatsAppMessage,
  getWhatsAppStatus,
};

