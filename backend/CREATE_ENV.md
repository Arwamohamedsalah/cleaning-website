# 📝 إنشاء ملف .env خطوة بخطوة

## الخطوة 1: إنشاء الملف

1. افتح مجلد `backend` في VS Code أو أي محرر نصوص
2. أنشئ ملف جديد باسم `.env` (بالضبط - مع النقطة في البداية)
3. انسخ المحتوى التالي:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# JWT Expiration
JWT_EXPIRE=30d
```

## الخطوة 2: الحصول على رابط MongoDB Atlas

### أ. إذا كان لديك حساب MongoDB Atlas:

1. اذهب إلى: https://www.mongodb.com/cloud/atlas
2. سجّل دخول
3. اضغط على **"Connect"** بجانب Cluster
4. اختر **"Connect your application"**
5. اختر **"Node.js"** و **Version: 5.5 or later**
6. انسخ الرابط الذي يظهر

**مثال على رابط من MongoDB Atlas:**
```
mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### ب. استبدل القيم:

1. استبدل `<username>` بـ username الذي أنشأته في MongoDB Atlas
2. استبدل `<password>` بـ password الذي أنشأته
3. أضف `/cleaning-service` قبل `?` (اسم قاعدة البيانات)

**مثال بعد الاستبدال:**
```
mongodb+srv://admin:mypassword123@cluster0.abc123.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

### ج. إذا لم يكن لديك حساب MongoDB Atlas:

اتبع التعليمات في `MONGODB_SETUP.md` لإنشاء حساب والحصول على رابط.

## الخطوة 3: تحديث ملف .env

1. افتح ملف `backend/.env`
2. استبدل السطر:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
   ```
   
   برابط MongoDB Atlas الصحيح

3. احفظ الملف

## الخطوة 4: اختبار الاتصال

```bash
cd backend
node server.js
```

**يجب أن ترى:**
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Server running in development mode on port 5000
```

---

## ⚠️ ملاحظات مهمة

1. **لا تشارك ملف `.env`** - يحتوي على كلمات مرور
2. **احفظ username و password** في مكان آمن
3. **تأكد من إضافة IP Address** في MongoDB Atlas → Network Access
4. **إذا كان password يحتوي على رموز خاصة** (مثل `@`, `#`, `%`):
   - استبدل `@` بـ `%40`
   - استبدل `#` بـ `%23`
   - استبدل `%` بـ `%25`

---

## 🔍 مثال كامل

**قبل:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

**بعد (مثال حقيقي):**
```env
MONGODB_URI=mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

---

## ❓ إذا استمر الخطأ

1. ✅ تحقق من أن الرابط يبدأ بـ `mongodb+srv://`
2. ✅ تحقق من أن username و password صحيحة
3. ✅ تحقق من أن Cluster ID صحيح (مثل `cluster0.abc123`)
4. ✅ تحقق من أن IP Address موجود في Network Access
5. ✅ جرب نسخ الرابط مرة أخرى من MongoDB Atlas

