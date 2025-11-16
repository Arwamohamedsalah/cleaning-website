import makeWASocket, { useMultiFileAuthState, Browsers, DisconnectReason } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';

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

  try {
    // Auth state stored in folder
    const { state, saveCreds } = await useMultiFileAuthState('./whatsapp-session');

    whatsappClient = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      browser: Browsers.appropriate('Desktop'),
      syncFullHistory: false,
    });

    // QR printed automatically; also show a terminal QR if needed via event
    whatsappClient.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        console.log('📱 امسح رمز QR التالي باستخدام WhatsApp:');
        qrcode.generate(qr, { small: true });
      }
      if (connection === 'open') {
        console.log('✅ WhatsApp Client جاهز!');
        isReady = true;
      } else if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('⚠️ تم قطع الاتصال. willReconnect=', shouldReconnect);
        isReady = false;
        if (shouldReconnect) {
          isInitialized = false;
          whatsappClient = null;
          initializeWhatsApp(); // try to re-init
        }
      }
    });

    // persist creds
    whatsappClient.ev.on('creds.update', saveCreds);

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
    if (!isInitialized || !whatsappClient) {
      whatsappClient = await initializeWhatsApp();
    }

    // Wait for ready up to 30 seconds
    let attempts = 0;
    while (!isReady && attempts < 30) {
      await new Promise(r => setTimeout(r, 1000));
      attempts++;
    }

    if (!isReady) {
      return { success: false, error: 'WhatsApp Client غير جاهز. يرجى مسح رمز QR أولاً.' };
    }

    const formattedPhone = formatPhoneNumber(to);
    const jid = `${formattedPhone}@s.whatsapp.net`;

    const result = await whatsappClient.sendMessage(jid, { text: message });

    return { success: true, messageId: result?.key?.id || '', data: result };
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

