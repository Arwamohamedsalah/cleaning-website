# 🚀 دليل رفع المشروع على Production - ardbk.com

## 📋 المتطلبات

1. Node.js (v18 أو أحدث)
2. MongoDB Atlas أو MongoDB Server
3. Domain: ardbk.com
4. Server مع إمكانية الوصول للإنترنت

## 🔧 خطوات الإعداد

### 1. إعداد متغيرات البيئة (Environment Variables)

```bash
cd backend
cp .env.production.example .env
```

ثم عدّل ملف `.env` بالقيم الصحيحة:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://ardbk.com
JWT_SECRET=your_very_strong_secret_key_here
```

### 2. بناء Frontend للإنتاج

```bash
# من المجلد الرئيسي
npm install
npm run build
```

سيتم إنشاء مجلد `dist` يحتوي على ملفات الإنتاج.

### 3. تثبيت Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
```

### 4. تشغيل المشروع في Production

#### الطريقة الأولى: تشغيل Backend فقط (يخدم Frontend أيضاً)

```bash
cd backend
npm run prod
```

الـ Backend سيعمل على البورت 3001 ويخدم:
- API: `http://ardbk.com:3001/api`
- Frontend: `http://ardbk.com:3001`

#### الطريقة الثانية: استخدام PM2 (مُوصى به)

```bash
# تثبيت PM2
npm install -g pm2

# تشغيل Backend
cd backend
pm2 start server.js --name cleaning-backend --env production

# حفظ إعدادات PM2
pm2 save
pm2 startup
```

### 5. إعداد Nginx (اختياري - مُوصى به)

إذا كنت تستخدم Nginx كـ reverse proxy:

```nginx
server {
    listen 80;
    server_name ardbk.com www.ardbk.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 6. إعداد SSL/HTTPS (مُوصى به بشدة)

استخدم Let's Encrypt:

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d ardbk.com -d www.ardbk.com
```

## 📝 ملاحظات مهمة

1. **API Base URL**: في Production، الـ API Base URL سيكون تلقائياً `http://ardbk.com/api` (نفس الدومين)
2. **CORS**: تم إعداد CORS للسماح بـ `ardbk.com` و `www.ardbk.com`
3. **Static Files**: الـ Backend يخدم ملفات Frontend من مجلد `dist`
4. **Port**: كل شيء يعمل على نفس البورت (3001)

## 🔍 التحقق من الإعداد

1. تحقق من أن الـ Backend يعمل:
   ```bash
   curl http://ardbk.com:3001/api/health
   ```

2. تحقق من أن Frontend يعمل:
   ```bash
   curl http://ardbk.com:3001
   ```

3. افتح المتصفح واذهب إلى:
   ```
   http://ardbk.com:3001
   ```

## 🛠️ تحديث المشروع

عند تحديث الكود:

```bash
# 1. بناء Frontend جديد
npm run build

# 2. إعادة تشغيل Backend
cd backend
pm2 restart cleaning-backend
# أو
npm run prod
```

## ⚠️ أمان

1. تأكد من تغيير `JWT_SECRET` إلى قيمة قوية وعشوائية
2. استخدم HTTPS في Production
3. قيّد Network Access في MongoDB Atlas
4. لا ترفع ملف `.env` إلى GitHub

## 📞 الدعم

إذا واجهت أي مشاكل، تحقق من:
- Logs: `pm2 logs cleaning-backend`
- MongoDB Connection
- Port 3001 متاح
- ملف `.env` موجود وصحيح

