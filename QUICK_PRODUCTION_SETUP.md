# ⚡ إعداد سريع للإنتاج

## على السيرفر، شغّل:

```bash
# 1. SSH إلى السيرفر
ssh root@72.61.94.71

# 2. الانتقال إلى مجلد المشروع
cd /var/www/cleaning

# 3. جلب التحديثات
git pull origin reports-improvements
# أو
git pull origin main

# 4. تشغيل script الإعداد
chmod +x SETUP_PRODUCTION.sh
bash SETUP_PRODUCTION.sh

# 5. تعديل ملف .env (إذا لزم الأمر)
nano backend/.env
```

## أو يدوياً:

```bash
# 1. إعداد .env
cd /var/www/cleaning/backend
cp PRODUCTION_ENV.txt .env
nano .env

# 2. تثبيت dependencies
cd /var/www/cleaning
npm install
cd backend && npm install && cd ..

# 3. بناء Frontend
npm run build

# 4. نسخ ملفات البناء
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/

# 5. بدء PM2
cd /var/www/cleaning
pm2 start pm2-ecosystem.config.js
pm2 save
```

## التحقق:

```bash
# حالة PM2
pm2 status

# السجلات
pm2 logs cleaning-backend

# اختبار API
curl https://ardbk.com/api/health
```

