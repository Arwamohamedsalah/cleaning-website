# ⚡ رفع سريع على Hostinger - ardbk.com

## 🚀 خطوات سريعة (5 دقائق)

### 1️⃣ إعداد ملف .env

```bash
# في Hostinger File Manager
# 1. اذهب إلى backend/
# 2. أنشئ ملف .env
# 3. انسخ محتوى backend/HOSTINGER_ENV.txt
# 4. عدّل القيم:
```

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/cleaning-service
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://ardbk.com
JWT_SECRET=YOUR_STRONG_SECRET_KEY
ADMIN_PASSWORD=YOUR_STRONG_PASSWORD
```

### 2️⃣ رفع الملفات

- ارفع جميع ملفات المشروع إلى Hostinger
- تأكد من رفع `.htaccess` في الجذر

### 3️⃣ تثبيت وبناء

```bash
npm install
cd backend && npm install && cd ..
npm run build
```

### 4️⃣ إعداد Node.js App

في Hostinger Panel > Node.js:
- **App Root**: `/backend`
- **Start Command**: `node server.js`
- **Port**: `3000`
- **Environment**: `NODE_ENV=production`

### 5️⃣ تشغيل

- اضغط **Start** في Node.js Panel
- افتح `https://ardbk.com`

---

## ✅ التحقق

- [ ] `https://ardbk.com` يفتح الموقع
- [ ] `https://ardbk.com/api/health` يرجع JSON
- [ ] لا توجد أخطاء في Logs

---

## 🔄 عند التحديث

```bash
npm run build
# ثم Restart في Hostinger Node.js Panel
```

---

**للمزيد من التفاصيل**: راجع `HOSTINGER_DEPLOYMENT.md`

