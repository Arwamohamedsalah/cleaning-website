#!/bin/bash

# ============================================
# Script لإعداد الموقع للإنتاج
# ============================================

echo "🚀 بدء إعداد الموقع للإنتاج..."

# الانتقال إلى مجلد المشروع
cd /var/www/cleaning || exit 1

# 1. إعداد ملف .env
echo "📝 إعداد ملف .env..."
if [ ! -f backend/.env ]; then
    if [ -f backend/PRODUCTION_ENV.txt ]; then
        cp backend/PRODUCTION_ENV.txt backend/.env
        echo "✅ تم نسخ PRODUCTION_ENV.txt إلى .env"
        echo "⚠️  يرجى تعديل ملف .env وإضافة القيم الصحيحة:"
        echo "   - MONGODB_URI"
        echo "   - JWT_SECRET"
        echo "   - ADMIN_PASSWORD"
    else
        echo "❌ ملف PRODUCTION_ENV.txt غير موجود"
        exit 1
    fi
else
    echo "✅ ملف .env موجود بالفعل"
fi

# 2. تثبيت dependencies
echo "📦 تثبيت dependencies..."
npm install
cd backend && npm install && cd ..

# 3. بناء Frontend
echo "🏗️  بناء Frontend..."
npm run build

# 4. نسخ ملفات البناء
echo "📋 نسخ ملفات البناء..."
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/
echo "✅ تم نسخ ملفات البناء إلى /var/www/client/"

# 5. بدء/إعادة تشغيل PM2
echo "🔄 إعداد PM2..."
cd /var/www/cleaning

# التحقق من وجود العملية
if pm2 list | grep -q "cleaning-backend"; then
    echo "✅ العملية موجودة، إعادة التشغيل..."
    pm2 restart cleaning-backend
else
    echo "🆕 بدء العملية الجديدة..."
    if [ -f pm2-ecosystem.config.js ]; then
        pm2 start pm2-ecosystem.config.js
    else
        cd backend
        pm2 start server.js --name cleaning-backend --env production
        cd ..
    fi
fi

# حفظ قائمة PM2
pm2 save

echo "✅ تم إعداد الموقع للإنتاج بنجاح!"
echo ""
echo "📋 الخطوات التالية:"
echo "1. تحقق من ملف .env: nano /var/www/cleaning/backend/.env"
echo "2. تحقق من حالة PM2: pm2 status"
echo "3. تحقق من السجلات: pm2 logs cleaning-backend"
echo "4. افتح الموقع: https://ardbk.com"

