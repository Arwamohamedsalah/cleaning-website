# 🔧 حل مشكلة PM2: Process not found

## المشكلة:
```
[PM2][ERROR] Process or Namespace cleaning-backend not found
```

## الحل:

### 1. التحقق من العمليات الحالية:
```bash
pm2 list
```

### 2. إذا لم تكن العملية موجودة، ابدأها:

#### الطريقة الأولى: استخدام ملف ecosystem
```bash
cd /var/www/cleaning
pm2 start pm2-ecosystem.config.js
```

#### الطريقة الثانية: البدء يدوياً
```bash
cd /var/www/cleaning/backend
pm2 start server.js --name cleaning-backend --env production
```

### 3. حفظ قائمة PM2:
```bash
# حفظ القائمة الحالية
pm2 save

# تفعيل التشغيل التلقائي عند إعادة تشغيل السيرفر
pm2 startup
# ثم شغّل الأمر الذي يظهر لك
```

### 4. التحقق من الحالة:
```bash
pm2 status
pm2 logs cleaning-backend --lines 20
```

### 5. إذا كانت العملية موجودة باسم آخر:
```bash
# عرض جميع العمليات
pm2 list

# استخدم الاسم الصحيح، مثلاً:
pm2 restart 0
# أو
pm2 restart all
```

## أوامر PM2 المفيدة:

```bash
# عرض جميع العمليات
pm2 list

# عرض معلومات عملية محددة
pm2 describe cleaning-backend

# عرض السجلات
pm2 logs cleaning-backend

# إيقاف عملية
pm2 stop cleaning-backend

# حذف عملية
pm2 delete cleaning-backend

# إعادة تشغيل جميع العمليات
pm2 restart all

# إعادة تحميل (بدون downtime)
pm2 reload cleaning-backend
```

