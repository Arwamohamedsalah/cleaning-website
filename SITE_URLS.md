# 🔗 روابط الموقع - Site URLs

## 📍 الروابط الأساسية

### 🌐 Frontend (الواجهة الأمامية)
```
http://localhost:3000
```

### 🔧 Backend API (السيرفر)
```
http://localhost:3001
```

### 🔌 API Endpoints
```
http://localhost:3001/api
```

---

## 🚀 كيفية الوصول للموقع

### 1️⃣ شغل Backend أولاً:
```bash
cd backend
npm run dev
```

السيرفر سيعمل على: `http://localhost:3001`

### 2️⃣ شغل Frontend:
```bash
npm run dev
```

الموقع سيفتح تلقائياً على: `http://localhost:3000`

---

## 📱 صفحات الموقع

### الصفحات العامة:
- **الصفحة الرئيسية:** `http://localhost:3000/`
- **العاملات:** `http://localhost:3000/workers`
- **الخدمات:** `http://localhost:3000/services`
- **توظيف:** `http://localhost:3000/assistants`
- **تواصل:** `http://localhost:3000/contact`
- **طلب خدمة:** `http://localhost:3000/service-request`
- **تسجيل الدخول:** `http://localhost:3000/login`

### Dashboard (لوحة التحكم):
- **نظرة عامة:** `http://localhost:3000/dashboard`
- **الطلبات:** `http://localhost:3000/dashboard/orders`
- **العملاء:** `http://localhost:3000/dashboard/customers`
- **العاملات:** `http://localhost:3000/dashboard/workers`
- **طلبات التوظيف:** `http://localhost:3000/dashboard/applications`
- **الرسائل:** `http://localhost:3000/dashboard/messages`
- **التقارير:** `http://localhost:3000/dashboard/reports`
- **الملف الشخصي:** `http://localhost:3000/dashboard/profile`

---

## 🔍 API Endpoints

### Health Check:
```
GET http://localhost:3001/api/health
```

### Authentication:
```
POST http://localhost:3001/api/auth/login
POST http://localhost:3001/api/auth/register
GET  http://localhost:3001/api/auth/me
```

### Orders:
```
GET    http://localhost:3001/api/orders
POST   http://localhost:3001/api/orders
GET    http://localhost:3001/api/orders/:id
PUT    http://localhost:3001/api/orders/:id
DELETE http://localhost:3001/api/orders/:id
```

### Customers:
```
GET    http://localhost:3001/api/customers
POST   http://localhost:3001/api/customers
GET    http://localhost:3001/api/customers/:id
PUT    http://localhost:3001/api/customers/:id
DELETE http://localhost:3001/api/customers/:id
```

### Workers:
```
GET    http://localhost:3001/api/workers
POST   http://localhost:3001/api/workers
GET    http://localhost:3001/api/workers/:id
PUT    http://localhost:3001/api/workers/:id
DELETE http://localhost:3001/api/workers/:id
```

### Applications:
```
GET    http://localhost:3001/api/applications
POST   http://localhost:3001/api/applications
GET    http://localhost:3001/api/applications/:id
PUT    http://localhost:3001/api/applications/:id
POST   http://localhost:3001/api/applications/:id/accept
POST   http://localhost:3001/api/applications/:id/reject
DELETE http://localhost:3001/api/applications/:id
```

### Messages:
```
GET    http://localhost:3001/api/messages
POST   http://localhost:3001/api/messages
GET    http://localhost:3001/api/messages/:id
PUT    http://localhost:3001/api/messages/:id
POST   http://localhost:3001/api/messages/:id/reply
DELETE http://localhost:3001/api/messages/:id
```

---

## ⚙️ الإعدادات الحالية

### Frontend:
- **Port:** 3000
- **URL:** http://localhost:3000
- **API URL:** http://localhost:3001/api

### Backend:
- **Port:** 3001
- **URL:** http://localhost:3001
- **CORS:** مُعد للسماح بـ http://localhost:3000

---

## 📝 ملاحظات مهمة

1. ✅ يجب تشغيل Backend أولاً قبل Frontend
2. ✅ Backend يعمل على البورت 3001
3. ✅ Frontend يعمل على البورت 3000
4. ✅ CORS مُعد بشكل صحيح
5. ✅ API Base URL: `http://localhost:3001/api`

---

## 🎯 الرابط الرئيسي للموقع

### افتح هذا الرابط في المتصفح:
```
http://localhost:3000
```

الموقع سيفتح تلقائياً عند تشغيل `npm run dev` في Frontend! 🚀

