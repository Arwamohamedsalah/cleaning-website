# 🚀 دليل رفع المشروع على Hostinger - ardbk.com

## 📋 المتطلبات

1. حساب Hostinger مع Node.js مفعّل
2. Domain: ardbk.com مربوط بـ Hostinger
3. MongoDB Atlas account (أو MongoDB database)
4. File Manager access في Hostinger

---

## 🔧 الخطوة 1: إعداد ملف .env على Hostinger

### 1.1 افتح File Manager في Hostinger

1. سجّل دخول إلى Hostinger Panel
2. اذهب إلى **File Manager**
3. افتح مجلد المشروع (عادة `public_html` أو المجلد المخصص)

### 1.2 أنشئ ملف .env في مجلد backend

1. اذهب إلى مجلد `backend`
2. أنشئ ملف جديد باسم `.env` (مع النقطة في البداية)
3. افتح ملف `backend/HOSTINGER_ENV.txt` من المشروع
4. انسخ المحتوى كاملاً
5. الصق المحتوى في ملف `.env` على Hostinger

### 1.3 عدّل ملف .env بالقيم الصحيحة

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://ardbk.com

# JWT Secret (مهم جداً - استبدله بمفتاح قوي)
JWT_SECRET=YOUR_VERY_STRONG_SECRET_KEY_HERE

# Admin Credentials
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@ardbk.com
ADMIN_PASSWORD=YOUR_STRONG_PASSWORD_HERE
ADMIN_PHONE=0500000000
```

**⚠️ مهم:**
- استبدل `YOUR_USERNAME` و `YOUR_PASSWORD` بـ MongoDB credentials
- استبدل `YOUR_VERY_STRONG_SECRET_KEY_HERE` بمفتاح عشوائي قوي
- استبدل `YOUR_STRONG_PASSWORD_HERE` بكلمة مرور قوية لـ Admin

---

## 📦 الخطوة 2: رفع الملفات على Hostinger

### 2.1 رفع جميع الملفات

1. استخدم **File Manager** أو **FTP** لرفع جميع ملفات المشروع
2. تأكد من رفع:
   - جميع ملفات `backend/`
   - جميع ملفات `src/`
   - `package.json` (في الجذر)
   - `package.json` (في `backend/`)
   - `vite.config.js`
   - `.htaccess`
   - أي ملفات أخرى

### 2.2 هيكل المجلدات على Hostinger

```
public_html/ (أو المجلد المخصص)
├── backend/
│   ├── .env (أنشئه يدوياً)
│   ├── server.js
│   ├── package.json
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ... (جميع ملفات backend)
├── src/
├── public/
├── dist/ (سيتم إنشاؤه بعد البناء)
├── package.json
├── vite.config.js
└── .htaccess
```

---

## 🏗️ الخطوة 3: بناء Frontend للإنتاج

### 3.1 تثبيت Dependencies

افتح **Terminal** في Hostinger (أو استخدم SSH):

```bash
# تثبيت Frontend dependencies
npm install

# تثبيت Backend dependencies
cd backend
npm install
cd ..
```

### 3.2 بناء Frontend

```bash
npm run build
```

سيتم إنشاء مجلد `dist` يحتوي على ملفات الإنتاج.

---

## ⚙️ الخطوة 4: إعداد Node.js App في Hostinger

### 4.1 إنشاء Node.js App

1. اذهب إلى **Node.js** في Hostinger Panel
2. اضغط **Create Application**
3. أدخل:
   - **App Name**: cleaning-service
   - **Node.js Version**: 18.x أو أحدث
   - **App Mode**: Production
   - **App Root**: `/backend` (أو المسار الصحيح)
   - **App URL**: `ardbk.com`
   - **Port**: `3000` (تحقق من البورت المحدد في Hostinger)

### 4.2 إعداد Start Command

في إعدادات Node.js App، حدّث **Start Command**:

```bash
node server.js
```

أو إذا كان المسار مختلف:

```bash
cd backend && node server.js
```

### 4.3 Environment Variables

في إعدادات Node.js App، أضف Environment Variables:

```
NODE_ENV=production
PORT=3000
```

(ملاحظة: باقي المتغيرات في ملف `.env`)

---

## 🔄 الخطوة 5: تشغيل التطبيق

### 5.1 تشغيل Node.js App

1. في Hostinger Node.js Panel
2. اضغط **Start** أو **Restart** على التطبيق
3. انتظر حتى يبدأ التطبيق

### 5.2 التحقق من التشغيل

افتح المتصفح واذهب إلى:
- `https://ardbk.com` - يجب أن يفتح الموقع
- `https://ardbk.com/api/health` - يجب أن يرجع `{"success":true,"message":"Server is running"}`

---

## 🔍 الخطوة 6: التحقق من الإعدادات

### 6.1 التحقق من MongoDB Connection

افتح Terminal في Hostinger:

```bash
cd backend
node test-connection.js
```

يجب أن ترى:
```
✅ MongoDB Connected: ...
```

### 6.2 التحقق من Logs

في Hostinger Node.js Panel:
1. اذهب إلى **Logs**
2. تحقق من أن لا توجد أخطاء
3. يجب أن ترى:
   ```
   ✅ MongoDB Connected: ...
   Server running in production mode on port 3000
   Frontend served from: ...
   ```

---

## 🛠️ الخطوة 7: إنشاء حساب Admin

### 7.1 إنشاء Admin عبر Terminal

```bash
cd backend
node scripts/createAdmin.js
```

أو استخدم البيانات من ملف `.env`:
- Email: `admin@ardbk.com`
- Password: (القيمة من `.env`)

---

## 🔐 الخطوة 8: إعداد SSL/HTTPS

### 8.1 تفعيل SSL في Hostinger

1. اذهب إلى **SSL** في Hostinger Panel
2. اضغط **Install SSL Certificate**
3. اختر **Let's Encrypt** (مجاني)
4. حدّث ملف `.env`:
   ```env
   FRONTEND_URL=https://ardbk.com
   ```

### 8.2 تحديث CORS

الـ CORS معدّ بالفعل في `server.js` لدعم `https://ardbk.com`

---

## 📝 الخطوة 9: تحديث المشروع (عند التحديث)

عند تحديث الكود:

```bash
# 1. رفع الملفات الجديدة
# 2. بناء Frontend جديد
npm run build

# 3. إعادة تشغيل Node.js App
# في Hostinger Panel > Node.js > Restart
```

---

## ⚠️ حل المشاكل الشائعة

### المشكلة 1: الموقع لا يفتح

**الحل:**
- تحقق من أن Node.js App يعمل
- تحقق من Logs في Hostinger
- تأكد من أن البورت صحيح (عادة 3000)

### المشكلة 2: MongoDB Connection Error

**الحل:**
- تحقق من `MONGODB_URI` في ملف `.env`
- تأكد من أن IP Server في Hostinger مضاف إلى MongoDB Atlas Whitelist
- في MongoDB Atlas: Network Access > Add IP Address > Add Current IP

### المشكلة 3: CORS Error

**الحل:**
- تأكد من أن `FRONTEND_URL` في `.env` = `https://ardbk.com`
- تحقق من أن الدومين في `allowedOrigins` في `server.js`

### المشكلة 4: API لا يعمل

**الحل:**
- تحقق من أن `/api/health` يعمل
- تأكد من أن `API_BASE_URL` في Frontend = `/api` (relative URL)
- تحقق من Logs في Hostinger

### المشكلة 5: Static Files لا تظهر

**الحل:**
- تأكد من أن `npm run build` تم تنفيذه
- تحقق من وجود مجلد `dist`
- تأكد من أن `server.js` يخدم ملفات من `dist`

---

## 📞 الدعم

إذا واجهت مشاكل:

1. تحقق من **Logs** في Hostinger Node.js Panel
2. تحقق من ملف `.env` في `backend/`
3. تحقق من MongoDB Connection
4. تحقق من أن جميع Dependencies مثبتة

---

## ✅ Checklist قبل الرفع

- [ ] ملف `.env` موجود في `backend/` مع جميع القيم الصحيحة
- [ ] MongoDB URI صحيح و IP مضاف إلى Whitelist
- [ ] `JWT_SECRET` تم تغييره إلى مفتاح قوي
- [ ] `ADMIN_PASSWORD` تم تغييره
- [ ] `FRONTEND_URL` = `https://ardbk.com`
- [ ] `PORT` = `3000` (أو البورت المحدد في Hostinger)
- [ ] `NODE_ENV` = `production`
- [ ] تم بناء Frontend (`npm run build`)
- [ ] Node.js App معدّ في Hostinger
- [ ] SSL مفعّل
- [ ] تم اختبار `/api/health`

---

## 🎉 جاهز!

بعد اكتمال جميع الخطوات، الموقع سيعمل على:
- **الموقع**: `https://ardbk.com`
- **API**: `https://ardbk.com/api`
- **Health Check**: `https://ardbk.com/api/health`

كل شيء يعمل على نفس الدومين والبورت! 🚀

