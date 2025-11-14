# دليل إعداد Backend وربطه بالـ Frontend

## 📋 خطوات الإعداد

### 1. إعداد MongoDB Atlas

1. أنشئ حساب على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ cluster جديد (Free tier متاح)
3. أنشئ Database User:
   - اذهب إلى Database Access
   - اضغط Add New Database User
   - اختر Password authentication
   - احفظ Username و Password
4. أضف IP Address إلى Network Access:
   - اذهب إلى Network Access
   - اضغط Add IP Address
   - للـ development: اضغط "Allow Access from Anywhere" (0.0.0.0/0)
5. احصل على Connection String:
   - اذهب إلى Clusters
   - اضغط Connect
   - اختر "Connect your application"
   - انسخ Connection String
   - استبدل `<password>` بكلمة المرور التي أنشأتها
   - استبدل `<dbname>` بـ `cleaning-service`

### 2. إعداد Backend

1. **انتقل إلى مجلد Backend:**
```bash
cd backend
```

2. **ثبت المكتبات:**
```bash
npm install
```

3. **أنشئ ملف `.env`:**
```bash
# في Windows
copy .env.example .env

# في Mac/Linux
cp .env.example .env
```

4. **عدّل ملف `.env` وأضف معلوماتك:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

5. **شغّل الـ Backend:**
```bash
npm run dev
```

يجب أن ترى رسالة: `Server running in development mode on port 5000`

### 3. إعداد Frontend

1. **أنشئ ملف `.env` في جذر المشروع:**
```env
VITE_API_URL=http://localhost:5000/api
```

2. **شغّل الـ Frontend:**
```bash
npm run dev
```

### 4. إنشاء مستخدم Admin أولي

بعد تشغيل الـ Backend، يمكنك إنشاء مستخدم admin أولي باستخدام MongoDB Compass أو من خلال API:

**استخدم MongoDB Compass:**
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

**ملاحظة:** كلمة المرور ستُشفّر تلقائياً عند الحفظ بسبب `pre('save')` hook في User model.

**أو استخدم Postman/Thunder Client:**
1. POST إلى `http://localhost:5000/api/auth/register`
2. Headers: `Authorization: Bearer <token>` (ستحتاج token من تسجيل دخول مؤقت)
3. Body:
```json
{
  "name": "مدير النظام",
  "email": "admin@cleaning.com",
  "password": "admin123",
  "role": "admin"
}
```

### 5. اختبار الاتصال

1. **افتح المتصفح واذهب إلى:** `http://localhost:3000`
2. **سجّل الدخول باستخدام:**
   - Email/Username: `admin@cleaning.com` أو `admin`
   - Password: `admin123`

### 6. تحديث Redux Slices للاتصال بالـ API

تم إنشاء ملف `src/services/api.js` الذي يحتوي على جميع دوال API.

**مثال على تحديث authSlice:**
```javascript
import { authAPI } from '../services/api';

// في async thunk
const loginUser = createAsyncThunk('auth/login', async ({ username, password }) => {
  const response = await authAPI.login(username, password);
  return response.data;
});
```

## 🔧 استكشاف الأخطاء

### مشكلة: "Cannot connect to MongoDB"
- تأكد من أن Connection String صحيح
- تأكد من أن IP Address مضاف في Network Access
- تأكد من أن Database User موجود وصحيح

### مشكلة: "CORS error"
- تأكد من أن `FRONTEND_URL` في `.env` صحيح
- تأكد من أن الـ Backend يعمل على port 5000
- تأكد من أن الـ Frontend يعمل على port 3000

### مشكلة: "401 Unauthorized"
- تأكد من أن token موجود في localStorage
- تأكد من أن token صحيح وغير منتهي
- جرب تسجيل الدخول مرة أخرى

## 📝 ملاحظات مهمة

1. **في Production:**
   - غيّر `JWT_SECRET` إلى قيمة عشوائية قوية
   - استخدم HTTPS
   - قيّد Network Access في MongoDB Atlas
   - استخدم متغيرات بيئة آمنة

2. **الـ Backend يعمل على:** `http://localhost:5000`
3. **الـ Frontend يعمل على:** `http://localhost:3000`
4. **API Base URL:** `http://localhost:5000/api`

## 🚀 الخطوات التالية

بعد إعداد الـ Backend، ستحتاج إلى:
1. تحديث Redux slices للاتصال بالـ API بدلاً من Mock data
2. تحديث جميع الصفحات لاستخدام API calls
3. إضافة error handling
4. إضافة loading states

