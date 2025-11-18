# 🚀 رفع المشروع من GitHub على السيرفر

## 📍 معلومات المستودع

- **GitHub Repo**: https://github.com/Arwamohamedsalah/cleaning-website
- **VPS IP**: 72.61.94.71
- **Domain**: ardbk.com

---

## ⚡ الطريقة السريعة (أمر واحد)

### SSH إلى السيرفر ثم شغّل:

```bash
ssh root@72.61.94.71
```

### ثم:

```bash
cd /tmp && curl -o deploy.sh https://raw.githubusercontent.com/Arwamohamedsalah/cleaning-website/main/QUICK_DEPLOY_SERVER.sh && chmod +x deploy.sh && bash deploy.sh
```

---

## 📝 الخطوات التفصيلية

### 1. الاتصال بالسيرفر

```bash
ssh root@72.61.94.71
```

### 2. تحميل وتشغيل Script

```bash
cd /tmp
curl -o deploy.sh https://raw.githubusercontent.com/Arwamohamedsalah/cleaning-website/main/QUICK_DEPLOY_SERVER.sh
chmod +x deploy.sh
bash deploy.sh
```

### 3. إعداد ملف .env للإنتاج

```bash
# نسخ ملف template للإنتاج
cd /var/www/cleaning/backend
cp PRODUCTION_ENV.txt .env

# تعديل ملف .env
nano .env
```

**عدّل القيم التالية:**
- `MONGODB_URI` - رابط MongoDB Atlas الخاص بك
- `JWT_SECRET` - مفتاح قوي وعشوائي
- `FRONTEND_URL=https://ardbk.com`
- `PORT=3000`
- `NODE_ENV=production`
- `SERVE_STATIC=false` (لأن Nginx يخدم الملفات الثابتة)
- `DISABLE_PUPPETEER=true` (لأن WhatsApp معطل حالياً)

### 4. التحقق من عمليات PM2 وإعادة تشغيل Backend

```bash
# التحقق من العمليات الحالية
pm2 list

# إذا كانت العملية موجودة باسم آخر، استخدم الاسم الصحيح
# أو إذا لم تكن موجودة، ابدأها:
cd /var/www/cleaning/backend
pm2 start server.js --name cleaning-backend

# أو استخدم ملف ecosystem
cd /var/www/cleaning
pm2 start pm2-ecosystem.config.js

# ثم إعادة التشغيل
pm2 restart cleaning-backend
# أو
pm2 restart all
```

---

## 🔄 تحديث المشروع لاحقاً

### إذا كان المشروع موجود بالفعل وعايز تحديثات (git pull):

```bash
# 1. الانتقال إلى مجلد المشروع
cd /var/www/cleaning

# 2. جلب التحديثات من GitHub
git pull origin main

# 3. تثبيت أي dependencies جديدة (إذا لزم الأمر)
npm install
cd backend && npm install && cd ..

# 4. بناء Frontend
npm run build

# 5. نسخ ملفات البناء إلى مجلد client
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/

# 6. إعادة تشغيل Backend
# أولاً تحقق من العمليات الموجودة
pm2 list

# إذا كانت العملية موجودة:
pm2 restart cleaning-backend

# إذا لم تكن موجودة، ابدأها:
cd /var/www/cleaning
pm2 start pm2-ecosystem.config.js

# أو يدوياً:
cd /var/www/cleaning/backend
pm2 start server.js --name cleaning-backend --env production

# 7. حفظ قائمة PM2 للتشغيل التلقائي
pm2 save
pm2 startup

# 8. التحقق من الحالة
pm2 status
pm2 logs cleaning-backend --lines 20
```

### إذا كان المشروع غير موجود (git clone):

```bash
# الانتقال إلى مجلد www
cd /var/www

# Clone المشروع من GitHub
git clone https://github.com/Arwamohamedsalah/cleaning-website.git cleaning

# الانتقال إلى مجلد المشروع
cd /var/www/cleaning

# تثبيت dependencies
npm install
cd backend && npm install && cd ..

# بناء Frontend
npm run build

# نسخ ملفات البناء إلى مجلد client
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/

# إعداد ملف .env
nano backend/.env

# إعادة تشغيل Backend
pm2 restart cleaning-backend
```

### للعمل مع Branch محدد (reports-improvements):

```bash
cd /var/www/cleaning
git fetch origin
git checkout reports-improvements
# أو merge مع main
git checkout main
git merge reports-improvements
npm run build
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/
pm2 restart cleaning-backend
```

---

## ✅ التحقق

- **الموقع**: https://ardbk.com
- **API**: https://ardbk.com/api/health

---

**المستودع**: https://github.com/Arwamohamedsalah/cleaning-website

