// WhatsApp integration is temporarily disabled on the server.
// import { sendWhatsAppMessage as sendViaWhatsAppWeb, initializeWhatsApp } from './whatsappClient.js';

/**
 * WhatsApp Service
 * WhatsApp integration is currently disabled.
 */

/**
 * Send WhatsApp message
 * @param {string} to - Phone number (with country code, e.g., 966501234567)
 * @param {string} message - Message text
 * @returns {Promise<Object>}
 */
export const sendWhatsAppMessage = async (to, message) => {
  console.log('ℹ️ WhatsApp integration is disabled. Message not sent.');
  return {
    success: false,
    error: 'WhatsApp integration is disabled حالياً.',
  };
};

/**
 * Send order confirmation via WhatsApp when order is created
 * @param {Object} order - Order object
 * @returns {Promise<Object>}
 */
export const sendOrderConfirmationViaWhatsApp = async (order) => {
  try {
    const customerPhone = order.phone;
    const orderDate = new Date(order.date).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `📋 تم استلام طلبك بنجاح!

🎯 رقم الطلب: ${order.orderNumber}

📅 تفاصيل الطلب:
• التاريخ: ${orderDate}
• الوقت: ${order.time || '09:00'}
• عدد العاملات: ${order.workers || 1}
• العنوان: ${order.address || 'سيتم التواصل معك'}

${order.notes ? `📝 ملاحظاتك: ${order.notes}\n` : ''}

⏳ سيتم مراجعة طلبك والتواصل معك قريباً لتأكيد الحجز.

شكراً لثقتك بنا! 🙏`;

    const result = await sendWhatsAppMessage(customerPhone, message);
    
    return result;
  } catch (error) {
    console.error('Error sending order confirmation via WhatsApp:', error);
    return {
      success: false,
      error: error.message || 'فشل إرسال رسالة واتساب',
    };
  }
};

/**
 * Send order acceptance message via WhatsApp
 * @param {Object} order - Order object
 * @returns {Promise<Object>}
 */
export const sendOrderAcceptanceViaWhatsApp = async (order) => {
  try {
    const customerPhone = order.phone;
    const orderDate = new Date(order.date).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let message = `✅ تم قبول طلب التنظيف من Ard elbaraka

📋 رقم الطلب: ${order.orderNumber}

📅 تفاصيل الطلب:
• التاريخ: ${orderDate}
• الوقت: ${order.time || '09:00'}
• عدد العاملات: ${order.workers || 1}
• العنوان: ${order.address || ''}

${order.notes ? `📝 ملاحظاتك: ${order.notes}\n` : ''}

شكراً لثقتك بنا! 🙏`;

    const result = await sendWhatsAppMessage(customerPhone, message);
    
    return result;
  } catch (error) {
    console.error('Error sending order acceptance via WhatsApp:', error);
    return {
      success: false,
      error: error.message || 'فشل إرسال رسالة واتساب',
    };
  }
};

/**
 * Send worker details via WhatsApp after order confirmation
 * @param {Object} order - Order object
 * @param {Object} worker - Worker object
 * @returns {Promise<Object>}
 */
export const sendWorkerDetailsViaWhatsApp = async (order, worker) => {
  try {
    const customerPhone = order.phone;
    const workerName = worker.arabicName || worker.name || 'العاملة';
    const workerPhone = worker.phone || '';
    const workerSkills = worker.skills?.join('، ') || 'لا توجد';
    const workerExperience = worker.experience || 0;
    const orderDate = new Date(order.date).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'gregory'
    });

    let message = `✅ تم قبول طلب التنظيف من Ard elbaraka

📋 رقم الطلب: ${order.orderNumber}

👷‍♀️ معلومات العاملة:
• الاسم: ${workerName}
${workerPhone ? `• رقم الهاتف: ${workerPhone}\n` : ''}${workerExperience > 0 ? `• الخبرة: ${workerExperience} سنوات\n` : ''}${workerSkills !== 'لا توجد' ? `• المهارات: ${workerSkills}\n` : ''}
📅 تفاصيل الحجز:
• التاريخ: ${orderDate}
• الوقت: ${order.time || '09:00'}
• عدد العاملات: ${order.workers || 1}
• العنوان: ${order.address || ''}

${order.notes ? `📝 ملاحظاتك: ${order.notes}\n` : ''}

شكراً لثقتك بنا! 🙏`;

    const result = await sendWhatsAppMessage(customerPhone, message);
    
    return result;
  } catch (error) {
    console.error('Error sending worker details via WhatsApp:', error);
    return {
      success: false,
      error: error.message || 'فشل إرسال رسالة واتساب',
    };
  }
};


/**
 * Send application confirmation via WhatsApp when application is created
 * @param {Object} application - Application object
 * @returns {Promise<Object>}
 */
export const sendApplicationConfirmationViaWhatsApp = async (application) => {
  try {
    // Get company WhatsApp number from settings or use default
    const companyPhone = process.env.COMPANY_WHATSAPP || '966501234567';
    
    const applicationDate = new Date(application.createdAt).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `📋 طلب استقدام جديد

🎯 رقم الطلب: ${application.applicationNumber}

👤 معلومات المتقدمة:
• الاسم بالعربي: ${application.arabicName}
${application.englishName ? `• الاسم بالإنجليزي: ${application.englishName}\n` : ''}• الجنسية: ${application.nationality}
• العمر: ${application.age} سنة
• رقم الهاتف: ${application.phone}
• رقم الهوية/الإقامة: ${application.idNumber}

💼 معلومات العمل:
• نوع العقد: ${application.contractType === 'monthly' ? 'شهري' : application.contractType === 'yearly' ? 'سنوي' : 'يومي'}
• سنوات الخبرة: ${application.experience || 0}
• المهارات: ${application.skills?.join('، ') || 'لا توجد'}
• اللغات: ${application.languages?.join('، ') || 'لا توجد'}
${application.maritalStatus ? `• الحالة الاجتماعية: ${application.maritalStatus}\n` : ''}
📅 تاريخ التقديم: ${applicationDate}

${application.notes ? `📝 ملاحظات: ${application.notes}\n` : ''}
📸 عدد الصور: ${application.photos?.length || 0}

⏳ الحالة: قيد المراجعة`;

    const result = await sendWhatsAppMessage(companyPhone, message);
    
    return result;
  } catch (error) {
    console.error('Error sending application confirmation via WhatsApp:', error);
    return {
      success: false,
      error: error.message || 'فشل إرسال رسالة واتساب',
    };
  }
};

/**
 * Send contact message via WhatsApp when message is created
 * @param {Object} message - Message object
 * @returns {Promise<Object>}
 */
export const sendContactMessageViaWhatsApp = async (message) => {
  try {
    // Get company WhatsApp number from settings or use default
    const companyPhone = process.env.COMPANY_WHATSAPP || '966501234567';
    
    const messageDate = new Date(message.createdAt).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const subjectLabels = {
      'general': 'عام',
      'complaint': 'شكوى',
      'suggestion': 'اقتراح',
      'inquiry': 'استفسار',
      'other': 'أخرى'
    };

    const messageText = `📧 رسالة تواصل جديدة

👤 معلومات المرسل:
• الاسم: ${message.name}
• البريد الإلكتروني: ${message.email}
• رقم الهاتف: ${message.phone}
• الموضوع: ${subjectLabels[message.subject] || message.subject}

📝 الرسالة:
${message.message}

📅 تاريخ الإرسال: ${messageDate}`;

    const result = await sendWhatsAppMessage(companyPhone, messageText);
    
    return result;
  } catch (error) {
    console.error('Error sending contact message via WhatsApp:', error);
    return {
      success: false,
      error: error.message || 'فشل إرسال رسالة واتساب',
    };
  }
};

// Disabled WhatsApp function
const sendViaWhatsAppWeb = async () => ({
  success: false,
  error: 'WhatsApp integration is disabled حالياً.',
});

export default {
  sendWhatsAppMessage,
  sendOrderConfirmationViaWhatsApp,
  sendOrderAcceptanceViaWhatsApp,
  sendWorkerDetailsViaWhatsApp,
  sendApplicationConfirmationViaWhatsApp,
  sendContactMessageViaWhatsApp,
  sendViaWhatsAppWeb,
};

