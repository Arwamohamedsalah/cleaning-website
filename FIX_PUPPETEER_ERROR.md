# 🔧 حل مشكلة Puppeteer على السيرفر

## ❌ المشكلة

```
Error: Failed to launch the browser process!
libasound.so.2: cannot open shared object file: No such file or directory
```

## ✅ الحل

المشكلة: المكتبات المطلوبة لـ Chromium غير مثبتة على السيرفر.

### الحل السريع:

```bash
# على السيرفر - تشغيل سكريبت التثبيت
cd /root/cleaning-website
chmod +x install-puppeteer-deps.sh
./install-puppeteer-deps.sh
```

### أو التثبيت اليدوي:

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

## 🔄 بعد التثبيت

```bash
# إعادة تشغيل Backend
pm2 restart backend

# أو
cd /root/cleaning-website/backend
pm2 restart backend

# التحقق من الحالة
pm2 logs backend --lines 50
```

## ✅ التحقق من الحل

بعد التثبيت وإعادة التشغيل، يجب أن ترى:

```
✅ WhatsApp Client جاهز!
```

بدلاً من:

```
❌ Error: Failed to launch the browser process!
```

## 🛠️ حلول بديلة

### إذا لم يعمل الحل:

#### 1. تعطيل Puppeteer مؤقتاً:

```bash
# في ملف .env
DISABLE_PUPPETEER=true
```

#### 2. إعادة تثبيت whatsapp-web.js:

```bash
cd /root/cleaning-website/backend
rm -rf node_modules
npm install
```

#### 3. التحقق من الصلاحيات:

```bash
# التأكد من صلاحيات المجلد
chmod -R 755 /root/cleaning-website/backend
```

## 📝 ملاحظات

- المكتبات المطلوبة كبيرة الحجم (~200MB)
- قد تحتاج إلى مساحة كافية على السيرفر
- التثبيت قد يستغرق بضع دقائق

## 🔗 مراجع

- [Puppeteer Troubleshooting](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md)
- [Chromium Dependencies](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)

---

**الملف:** `install-puppeteer-deps.sh`  
**التاريخ:** 2024

