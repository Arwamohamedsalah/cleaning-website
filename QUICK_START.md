# دليل البدء السريع 🚀

## الخطوات السريعة

### 1️⃣ إعداد Backend

```bash
cd backend
npm install
```

أنشئ ملف `.env` في مجلد `backend`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**اختبر الاتصال:**
```bash
npm run test:db
```

**شغّل Backend:**
```bash
npm run dev
```

### 2️⃣ إعداد Frontend

أنشئ ملف `.env` في جذر المشروع:
```env
VITE_API_URL=http://localhost:5000/api
```

**شغّل Frontend:**
```bash
npm run dev
```

### 3️⃣ إنشاء مستخدم Admin

بعد تشغيل Backend، استخدم MongoDB Compass أو Postman:

**MongoDB Compass:**
1. اتصل بـ MongoDB Atlas
2. اذهب إلى collection `users`
3. أضف document جديد:
```json
{
  "name": "مدير النظام",
  "email": "admin@cleaning.com",
  "password": "admin123",
  "role": "admin",
  "isActive": true
}
```

**ملاحظة:** كلمة المرور ستُشفّر تلقائياً عند الحفظ.

### 4️⃣ تسجيل الدخول

1. اذهب إلى `http://localhost:3000/login`
2. استخدم:
   - Email/Username: `admin@cleaning.com` أو `admin`
   - Password: `admin123`

### 5️⃣ اختبار النظام

#### اختبار إرسال بيانات:
1. **طلب خدمة:** اذهب إلى `/service-request` وأرسل طلب
2. **طلب توظيف:** اذهب إلى `/recruitment` وأرسل طلب
3. **رسالة:** اذهب إلى `/contact` وأرسل رسالة

#### التحقق من Dashboard:
1. اذهب إلى `/dashboard`
2. تحقق من:
   - **Overview:** يجب أن تظهر الإحصائيات
   - **Orders:** يجب أن يظهر الطلب الجديد
   - **Applications:** يجب أن يظهر طلب التوظيف
   - **Messages:** يجب أن تظهر الرسالة

## ✅ إذا كل شيء يعمل:

- ✅ Backend يعمل على port 5000
- ✅ Frontend يعمل على port 3000
- ✅ MongoDB متصل
- ✅ يمكن تسجيل الدخول
- ✅ البيانات تظهر في Dashboard

## 🐛 إذا واجهت مشاكل:

راجع ملف `TEST_CONNECTION.md` لاستكشاف الأخطاء.

## 📞 المساعدة

- **Backend:** راجع `backend/README.md`
- **Integration:** راجع `INTEGRATION_GUIDE.md`
- **Setup:** راجع `BACKEND_SETUP.md`

