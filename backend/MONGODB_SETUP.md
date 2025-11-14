# إعداد MongoDB Atlas - خطوة بخطوة

## الخطوة 1: إنشاء حساب MongoDB Atlas

1. اذهب إلى: https://www.mongodb.com/cloud/atlas/register
2. سجّل حساب جديد (أو سجّل دخول إذا كان لديك حساب)
3. اختر **Free** (M0) - مجاني تماماً

## الخطوة 2: إنشاء Cluster

1. بعد تسجيل الدخول، اضغط على **"Build a Database"**
2. اختر **FREE** (M0 Sandbox)
3. اختر **Cloud Provider** و **Region** (اختر الأقرب لك)
4. اضغط **"Create"**
5. انتظر حتى يتم إنشاء الـ Cluster (قد يستغرق 1-3 دقائق)

## الخطوة 3: إنشاء Database User

1. في الشاشة التي تظهر، اختر **"Username and Password"**
2. أدخل:
   - **Username**: (مثلاً: `admin` أو أي اسم تريده)
   - **Password**: (كلمة مرور قوية - **احفظها!**)
3. اضغط **"Create Database User"**

## الخطوة 4: إعداد Network Access

1. في نفس الشاشة، اختر **"My Local Environment"** أو **"Add My Current IP Address"**
2. أو اختر **"Allow Access from Anywhere"** (للتطوير فقط - `0.0.0.0/0`)
3. اضغط **"Finish and Close"**

## الخطوة 5: الحصول على Connection String

1. بعد إنشاء الـ Cluster، اضغط على **"Connect"** (زر بجانب اسم الـ Cluster)
2. اختر **"Connect your application"**
3. اختر **"Node.js"** و **Version: 5.5 or later**
4. ستظهر لك connection string مثل:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **انسخ هذا الرابط**

## الخطوة 6: تحديث الرابط

1. استبدل `<username>` و `<password>` في الرابط بـ:
   - Username: الذي أنشأته في الخطوة 3
   - Password: كلمة المرور التي أنشأتها في الخطوة 3
2. أضف اسم قاعدة البيانات في نهاية الرابط:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
   ```
   (لاحظ `/cleaning-service` قبل `?`)

## الخطوة 7: إضافة الرابط إلى ملف .env

1. افتح ملف `backend/.env`
2. أضف السطر التالي:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
   ```
3. استبدل `username` و `password` و `cluster0.xxxxx` بالقيم الفعلية من MongoDB Atlas
4. احفظ الملف

## الخطوة 8: تشغيل Backend

```bash
cd backend
npm run dev
```

إذا ظهرت رسالة:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Server running in development mode on port 5000
```

**مبروك! 🎉 الاتصال نجح!**

---

## ملاحظات مهمة:

- ⚠️ **لا تشارك** ملف `.env` مع أحد (يحتوي على كلمات مرور)
- 🔒 **احفظ** كلمة مرور Database User في مكان آمن
- 📝 اسم قاعدة البيانات `cleaning-service` سيتم إنشاؤه تلقائياً عند أول اتصال

