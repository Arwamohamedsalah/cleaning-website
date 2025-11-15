import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { checkPuppeteerDependencies, installPuppeteerDependencies } from '../utils/checkPuppeteerDeps.js';

let whatsappClient = null;
let isInitialized = false;
let isReady = false;

/**
 * Initialize WhatsApp Client
 */
export const initializeWhatsApp = async () => {
  if (isInitialized) {
    return whatsappClient;
  }

  // Check if Puppeteer is disabled
  if (process.env.DISABLE_PUPPETEER === 'true') {
    console.log("⚠️ Puppeteer disabled on this server.");
    console.log("📱 WhatsApp Client will not be initialized.");
    return null;
  }

  try {
    // Check Puppeteer dependencies before initializing
    if (process.env.CHECK_PUPPETEER_DEPS !== 'false') {
      console.log('🔍 Checking Puppeteer dependencies...');
      const depsCheck = await checkPuppeteerDependencies();
      
      if (!depsCheck.installed) {
        console.warn('⚠️  Missing Puppeteer dependencies detected!');
        console.warn(`📦 Missing libraries: ${depsCheck.missing.join(', ')}`);
        console.warn(`📊 Status: ${depsCheck.installed || 0}/${depsCheck.total} libraries installed`);
        
        // Try to install automatically (if has sudo)
        if (process.env.AUTO_INSTALL_DEPS === 'true') {
          console.log('🔧 Attempting to install dependencies automatically...');
          const installResult = await installPuppeteerDependencies();
          
          if (!installResult.success) {
            console.error('❌ Auto-installation failed. Please install manually:');
            console.error(installResult.command || installResult.message);
            console.error('\n📝 Or run: ./install-puppeteer-deps.sh');
            console.error('📝 Or set DISABLE_PUPPETEER=true in .env to disable WhatsApp');
          } else {
            console.log('✅ Dependencies installed successfully!');
          }
        } else {
          console.error('❌ Please install missing dependencies:');
          console.error(`   ${depsCheck.installCommand || 'See FIX_PUPPETEER_ERROR.md'}`);
          console.error('📝 Or run: ./install-puppeteer-deps.sh');
          console.error('📝 Or set DISABLE_PUPPETEER=true in .env to disable WhatsApp');
        }
      } else {
        console.log('✅ All Puppeteer dependencies are installed');
      }
    }

    const clientConfig = {
      authStrategy: new LocalAuth({
        dataPath: './whatsapp-session'
      })
    };

    // Only add puppeteer config if not disabled
    // إعدادات Puppeteer للسيرفر بدون واجهة رسومية
    if (process.env.DISABLE_PUPPETEER !== 'true') {
      clientConfig.puppeteer = {
        headless: true, // تشغيل بدون واجهة رسومية (مهم للسيرفر)
        args: [
          '--no-sandbox', // تعطيل sandbox (مهم للسيرفر)
          '--disable-setuid-sandbox', // تعطيل setuid sandbox
          '--disable-dev-shm-usage', // حل مشاكل الذاكرة المشتركة
          '--disable-accelerated-2d-canvas', // تعطيل تسريع Canvas
          '--no-first-run', // تخطي أول تشغيل
          '--no-zygote', // تعطيل zygote process
          '--single-process', // تشغيل في process واحد (مهم للسيرفر محدود الموارد)
          '--disable-gpu' // تعطيل GPU (غير متوفر في السيرفر)
        ],
        // خيارات إضافية لبيئة السيرفر
        ignoreHTTPSErrors: true, // تجاهل أخطاء HTTPS
        timeout: 60000, // مهلة 60 ثانية
      };
    }

    whatsappClient = new Client(clientConfig);

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
    
    // Check if it's a dependency error
    if (error.message && (
      error.message.includes('libasound') ||
      error.message.includes('shared libraries') ||
      error.message.includes('cannot open shared object file')
    )) {
      console.error('\n🔧 هذا خطأ في المكتبات المطلوبة!');
      console.error('📝 الحل:');
      console.error('   1. شغّل: ./install-puppeteer-deps.sh');
      console.error('   2. أو: sudo apt-get install -y libasound2 libatk-bridge2.0-0 libgtk-3-0 ...');
      console.error('   3. أو: اضبط AUTO_INSTALL_DEPS=true في .env');
      console.error('   4. أو: اضبط DISABLE_PUPPETEER=true في .env لتعطيل WhatsApp');
      console.error('\n📚 راجع: FIX_PUPPETEER_ERROR.md للتفاصيل');
    }
    
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
      whatsappClient = await initializeWhatsApp();
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

