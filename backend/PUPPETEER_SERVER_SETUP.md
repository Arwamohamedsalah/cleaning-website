# 🔧 إعداد Puppeteer للسيرفر

## 📋 المشكلة

Puppeteer و `whatsapp-web.js` يحتاجان Chromium للعمل، لكن السيرفرات عادة لا تحتوي على:
- واجهة رسومية (GUI)
- مكتبات رسومية كاملة
- إعدادات Sandbox

## ✅ الحل

تم إضافة إعدادات خاصة بالسيرفر في `backend/services/whatsappClient.js`:

### الإعدادات المضافة:

```javascript
clientConfig.puppeteer = {
  headless: true, // تشغيل بدون واجهة رسومية
  args: [
    '--no-sandbox',                    // تعطيل sandbox (مهم جداً)
    '--disable-setuid-sandbox',        // تعطيل setuid sandbox
    '--disable-dev-shm-usage',         // حل مشاكل الذاكرة المشتركة
    '--disable-accelerated-2d-canvas',  // تعطيل تسريع Canvas
    '--no-first-run',                  // تخطي أول تشغيل
    '--no-zygote',                     // تعطيل zygote process
    '--single-process',                // تشغيل في process واحد
    '--disable-gpu'                    // تعطيل GPU
  ],
  ignoreHTTPSErrors: true,            // تجاهل أخطاء HTTPS
  timeout: 60000,                      // مهلة 60 ثانية
};
```

## 🔍 شرح الإعدادات

### `--no-sandbox`
- **السبب**: Sandbox يحتاج صلاحيات خاصة قد لا تكون متوفرة في السيرفر
- **الحل**: تعطيل sandbox للسماح بتشغيل Chromium

### `--disable-setuid-sandbox`
- **السبب**: setuid sandbox يحتاج صلاحيات root
- **الحل**: تعطيله لتجنب مشاكل الصلاحيات

### `--disable-dev-shm-usage`
- **السبب**: `/dev/shm` قد يكون محدود في السيرفرات
- **الحل**: استخدام `/tmp` بدلاً منه

### `--single-process`
- **السبب**: تقليل استهلاك الموارد
- **الحل**: تشغيل في process واحد بدلاً من عدة processes

### `--disable-gpu`
- **السبب**: السيرفرات لا تحتوي على GPU
- **الحل**: تعطيل GPU لتجنب الأخطاء

## 🚀 الاستخدام

### 1. التأكد من الإعدادات

الإعدادات موجودة بالفعل في الكود، لا حاجة لتعديل شيء.

### 2. تعطيل Puppeteer (اختياري)

إذا كان السيرفر لا يدعم Puppeteer نهائياً:

```env
# في ملف .env
DISABLE_PUPPETEER=true
```

### 3. تثبيت Dependencies المطلوبة

**الطريقة السريعة (مستحسن):**

```bash
# نسخ السكريبت إلى السيرفر
# ثم تشغيله:
chmod +x install-puppeteer-deps.sh
./install-puppeteer-deps.sh
```

**أو التثبيت اليدوي:**

```bash
# على Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

**⚠️ مهم:** إذا رأيت خطأ `libasound.so.2: cannot open shared object file`، فهذا يعني أن المكتبات غير مثبتة. راجع ملف `FIX_PUPPETEER_ERROR.md` للحل.

### 4. اختبار الإعدادات

```bash
# تشغيل Backend
cd backend
npm start

# يجب أن ترى:
# ✅ WhatsApp Client جاهز!
# أو
# ⚠️ Puppeteer disabled on this server.
```

## 🛠️ استكشاف الأخطاء

### المشكلة: `Failed to launch the browser process`

**الحل:**
1. تأكد من تثبيت جميع Dependencies المطلوبة
2. تأكد من وجود `--no-sandbox` في args
3. تحقق من الصلاحيات: `sudo chmod -R 755 /tmp`

### المشكلة: `Navigation timeout`

**الحل:**
- زيادة timeout في الإعدادات
- التحقق من اتصال الإنترنت

### المشكلة: `Cannot find module 'puppeteer'`

**الحل:**
```bash
cd backend
npm install whatsapp-web.js
```

## 📝 ملاحظات مهمة

1. **الأمان**: `--no-sandbox` يقلل الأمان، لكنه ضروري للسيرفرات
2. **الأداء**: `--single-process` قد يقلل الأداء قليلاً لكنه ضروري للسيرفرات محدودة الموارد
3. **الذاكرة**: `--disable-dev-shm-usage` يساعد في تجنب مشاكل الذاكرة

## ✅ قائمة التحقق

- [ ] الإعدادات موجودة في `whatsappClient.js`
- [ ] Dependencies مثبتة على السيرفر
- [ ] `DISABLE_PUPPETEER=false` في `.env` (أو غير موجود)
- [ ] Backend يعمل بدون أخطاء
- [ ] WhatsApp Client يتصل بنجاح

## 🔗 مراجع

- [Puppeteer Documentation](https://pptr.dev/)
- [whatsapp-web.js Documentation](https://wwebjs.dev/)
- [Chromium Flags](https://peter.sh/experiments/chromium-command-line-switches/)

---

**تم التحديث:** 2024  
**الملف:** `backend/services/whatsappClient.js`

