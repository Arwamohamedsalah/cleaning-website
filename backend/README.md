# 🧹 Cleaning Service Backend API

Backend API لنظام إدارة خدمات التنظيف باستخدام Node.js, Express, و MongoDB Atlas.

## 📋 المتطلبات

- Node.js (v16 أو أحدث)
- MongoDB Atlas account
- npm أو yarn

## 🚀 الإعداد السريع

### 1. إنشاء ملف .env

انسخ `ENV_TEMPLATE.txt` إلى `.env`:

```bash
copy ENV_TEMPLATE.txt .env
```

### 2. تحديث ملف .env

افتح `.env` وحدّث القيم التالية:

```env
# رابط MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# بيانات Admin
ADMIN_EMAIL=admin@cleaning.com
ADMIN_PASSWORD=admin123
```

### 3. تثبيت المكتبات

```bash
npm install
```

### 4. إنشاء حساب Admin

```bash
npm run create-admin
```

### 5. تشغيل السيرفر

```bash
npm run dev
```

السيرفر سيعمل على: `http://localhost:5000`

## 📝 Scripts المتاحة

- `npm start` - تشغيل السيرفر في وضع الإنتاج
- `npm run dev` - تشغيل السيرفر في وضع التطوير (مع nodemon)
- `npm run create-admin` - إنشاء حساب Admin
- `npm run test:db` - اختبار الاتصال بـ MongoDB

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي
- `PUT /api/auth/profile` - تحديث الملف الشخصي

### Orders
- `GET /api/orders` - الحصول على جميع الطلبات
- `POST /api/orders` - إنشاء طلب جديد
- `GET /api/orders/:id` - الحصول على طلب محدد
- `PUT /api/orders/:id` - تحديث طلب
- `POST /api/orders/:id/confirm` - تأكيد الحجز وإرسال واتساب
- `DELETE /api/orders/:id` - حذف طلب

### Workers
- `GET /api/workers` - الحصول على جميع العاملات
- `POST /api/workers` - إضافة عاملة جديدة
- `GET /api/workers/:id` - الحصول على عاملة محددة
- `PUT /api/workers/:id` - تحديث عاملة
- `DELETE /api/workers/:id` - حذف عاملة

### Customers
- `GET /api/customers` - الحصول على جميع العملاء
- `POST /api/customers` - إضافة عميل جديد
- `GET /api/customers/:id` - الحصول على عميل محدد
- `PUT /api/customers/:id` - تحديث عميل
- `DELETE /api/customers/:id` - حذف عميل

### Applications
- `GET /api/applications` - الحصول على جميع طلبات التوظيف
- `POST /api/applications` - إضافة طلب توظيف جديد
- `PUT /api/applications/:id` - تحديث طلب توظيف
- `POST /api/applications/:id/accept` - قبول طلب توظيف
- `POST /api/applications/:id/reject` - رفض طلب توظيف
- `DELETE /api/applications/:id` - حذف طلب توظيف

### Messages
- `GET /api/messages` - الحصول على جميع الرسائل
- `POST /api/messages` - إرسال رسالة جديدة
- `PUT /api/messages/:id` - تحديث رسالة
- `POST /api/messages/:id/reply` - الرد على رسالة
- `DELETE /api/messages/:id` - حذف رسالة

### Overview
- `GET /api/overview/stats` - إحصائيات Dashboard

## 🔐 Authentication

معظم الـ endpoints تتطلب Authentication. أرسل Token في Header:

```
Authorization: Bearer <your_token>
```

## 📦 Models

- **User** - المستخدمون (Admin, Manager, Worker)
- **Order** - الطلبات
- **Customer** - العملاء
- **Worker** - العاملات
- **Application** - طلبات التوظيف
- **Message** - الرسائل

## 🔧 Environment Variables

راجع `ENV_TEMPLATE.txt` لجميع متغيرات البيئة المتاحة.

## 📚 الملفات المهمة

- `server.js` - نقطة بداية السيرفر
- `config/database.js` - إعدادات MongoDB
- `middleware/auth.js` - Authentication middleware
- `controllers/` - Controllers للـ endpoints
- `models/` - Mongoose models
- `routes/` - API routes
- `services/whatsappService.js` - خدمة WhatsApp

## 🐛 Troubleshooting

### مشكلة الاتصال بـ MongoDB

1. تأكد من أن `MONGODB_URI` صحيح في `.env`
2. تأكد من أن IP الخاص بك مضاف في MongoDB Atlas Network Access
3. شغّل `npm run test:db` للتحقق من الاتصال

### مشكلة JWT

تأكد من أن `JWT_SECRET` موجود في `.env`

### مشكلة إنشاء Admin

تأكد من أن MongoDB متصل وأن `.env` محدّث بشكل صحيح.

## 📞 الدعم

للمساعدة، راجع:
- `QUICK_START.md` - دليل البدء السريع
- `README_SETUP.md` - دليل الإعداد التفصيلي
- `CREATE_ENV_INSTRUCTIONS.md` - تعليمات إنشاء .env
