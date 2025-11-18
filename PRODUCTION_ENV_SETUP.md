# 🔧 إعداد الموقع للإنتاج (Production)

## خطوات الإعداد:

### 1. إعداد ملف `.env` في مجلد `backend/`

أنشئ ملف `.env` في `/var/www/cleaning/backend/.env` مع المحتوى التالي:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://ardbk.com

# JWT Secret (استخدم سلسلة عشوائية قوية)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Admin User Credentials
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@cleaning.com
ADMIN_PASSWORD=admin123
ADMIN_PHONE=0500000000

# WhatsApp API Configuration (اختياري - معطل حالياً)
DISABLE_PUPPETEER=true
SERVE_STATIC=false
```

### 2. بناء Frontend للإنتاج

```bash
cd /var/www/cleaning
npm run build
```

### 3. نسخ ملفات البناء إلى مجلد client

```bash
rm -rf /var/www/client/*
cp -r /var/www/cleaning/dist/* /var/www/client/
```

### 4. بدء/إعادة تشغيل Backend مع PM2

```bash
cd /var/www/cleaning
pm2 start pm2-ecosystem.config.js
# أو إذا كانت موجودة
pm2 restart cleaning-backend

# حفظ القائمة
pm2 save
```

### 5. التحقق من الإعدادات

```bash
# التحقق من أن NODE_ENV=production
cd /var/www/cleaning/backend
grep NODE_ENV .env

# التحقق من أن PORT=3000
grep PORT .env

# التحقق من أن FRONTEND_URL=https://ardbk.com
grep FRONTEND_URL .env
```

### 6. اختبار الموقع

- افتح: `https://ardbk.com`
- تحقق من أن API يعمل: `https://ardbk.com/api/health`

## ملاحظات مهمة:

1. **NODE_ENV=production** - ضروري لتفعيل وضع الإنتاج
2. **PORT=3000** - يجب أن يكون نفس البورت المحدد في Nginx
3. **FRONTEND_URL=https://ardbk.com** - للـ CORS
4. **SERVE_STATIC=false** - لأن Nginx يخدم الملفات الثابتة
5. **DISABLE_PUPPETEER=true** - لأن WhatsApp معطل حالياً

