# 🔧 حل سريع لمشكلة mongoose على السيرفر

## المشكلة:
```
SyntaxError: Unexpected identifier 'mongoose'
```

## الحل السريع (نفذ على السيرفر):

### 1. SSH إلى السيرفر:
```bash
ssh root@72.61.94.71
```

### 2. تنفيذ الأوامر التالية:

```bash
cd /var/www/cleaning/backend

# إيقاف PM2
pm2 stop cleaning-backend
pm2 delete cleaning-backend

# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# التحقق من تثبيت mongoose
npm list mongoose

# إعادة تشغيل PM2
cd /var/www/cleaning
pm2 start pm2-ecosystem.config.js
pm2 save

# عرض السجلات
pm2 logs cleaning-backend --lines 50
```

### 3. إذا استمرت المشكلة:

```bash
# التحقق من إصدار Node.js (يجب أن يكون 16+)
node --version

# إذا كان قديم، قم بتحديثه:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# ثم أعد التثبيت
cd /var/www/cleaning/backend
rm -rf node_modules package-lock.json
npm install
```

### 4. التحقق من package.json:

تأكد من وجود:
```json
{
  "type": "module",
  "dependencies": {
    "mongoose": "^8.0.3"
  }
}
```

### 5. استخدام السكريبت التلقائي:

```bash
cd /var/www/cleaning
chmod +x FIX_MONGOOSE_ON_SERVER.sh
./FIX_MONGOOSE_ON_SERVER.sh
```

## ملاحظات:

- المشكلة غالباً بسبب عدم تثبيت mongoose في `node_modules`
- أو بسبب إصدار قديم من Node.js
- أو بسبب مشكلة في `package-lock.json`

## بعد الإصلاح:

```bash
# التحقق من أن السيرفر يعمل
pm2 status
pm2 logs cleaning-backend --lines 20
```

