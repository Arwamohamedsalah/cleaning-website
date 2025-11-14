# إعداد WhatsApp API

## الخطوات المطلوبة:

### 1. اختيار خدمة WhatsApp API

يمكنك استخدام إحدى الخدمات التالية:

#### أ) WhatsApp Business Cloud API (Meta)
- التسجيل: https://developers.facebook.com/docs/whatsapp
- يتطلب: حساب Facebook Business
- مجاني للرسائل القليلة، مدفوع للاستخدام الكبير

#### ب) Twilio WhatsApp API
- التسجيل: https://www.twilio.com/whatsapp
- يتطلب: حساب Twilio
- مدفوع حسب الاستخدام

#### ج) WhatsApp Web API (whatsapp-web.js)
- مكتبة Node.js للاتصال بـ WhatsApp Web
- مجاني تماماً
- يتطلب: QR Code scan في كل مرة

### 2. إعداد متغيرات البيئة

أضف إلى ملف `backend/.env`:

```env
# WhatsApp API Configuration
WHATSAPP_API_URL=https://api.whatsapp.com/v1
WHATSAPP_API_KEY=your_api_key_here
WHATSAPP_PHONE_NUMBER=your_phone_number
```

### 3. تثبيت المكتبات المطلوبة

```bash
cd backend
npm install axios
```

### 4. تحديث WhatsApp Service

قم بتحديث `backend/services/whatsappService.js` حسب الخدمة التي اخترتها.

### 5. اختبار الإرسال

بعد إعداد كل شيء، يمكنك اختبار الإرسال من Dashboard:
1. افتح Dashboard > Orders
2. اختر طلباً يحتوي على عاملة مختارة
3. اضغط "تأكيد الحجز وإرسال واتساب"

## ملاحظات:

- تأكد من أن رقم الهاتف بصيغة صحيحة (966XXXXXXXXX)
- الرسائل تُرسل تلقائياً عند تأكيد الحجز
- يمكنك تتبع حالة الإرسال من حقل `whatsappSent` في Order

