# 🔧 إصلاح مشكلة الاتصال بـ MongoDB

## ❌ المشكلة الحالية

```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

هذا الخطأ يعني أن:
1. ❌ رابط MongoDB غير صحيح أو غير موجود
2. ❌ أو أن الرابط يحتوي على `cluster.mongodb.net` بدلاً من رابط صحيح من MongoDB Atlas

---

## ✅ الحل

### الخطوة 1: احصل على رابط MongoDB Atlas الصحيح

اتبع التعليمات في `MONGODB_SETUP.md` للحصول على رابط MongoDB Atlas.

**باختصار:**
1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. سجّل دخول إلى حسابك
3. اضغط على **"Connect"** بجانب Cluster الخاص بك
4. اختر **"Connect your application"**
5. اختر **"Node.js"** و **Version: 5.5 or later**
6. انسخ الرابط الذي يظهر

**مثال على رابط صحيح:**
```
mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

**ملاحظات مهمة:**
- ✅ يجب أن يبدأ بـ `mongodb+srv://`
- ✅ يجب أن يحتوي على `cluster0.xxxxx.mongodb.net` (حيث xxxxx هو معرف Cluster الخاص بك)
- ✅ يجب أن تستبدل `<username>` و `<password>` بـ username و password التي أنشأتها
- ✅ يجب أن تضيف `/cleaning-service` قبل `?` (اسم قاعدة البيانات)

---

### الخطوة 2: تحديث ملف `.env`

1. افتح ملف `backend/.env`
2. استبدل السطر:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
   ```
   
   برابط MongoDB Atlas الصحيح الذي نسخته

3. **مثال:**
   ```
   MONGODB_URI=mongodb+srv://admin:mypassword123@cluster0.abc123.mongodb.net/cleaning-service?retryWrites=true&w=majority
   ```

4. احفظ الملف

---

### الخطوة 3: تأكد من إعدادات MongoDB Atlas

#### أ. Network Access (IP Whitelist)

1. اذهب إلى MongoDB Atlas Dashboard
2. اضغط على **"Network Access"** من القائمة الجانبية
3. تأكد من أن IP Address الخاص بك موجود في القائمة
4. أو أضف `0.0.0.0/0` للسماح من أي مكان (للتطوير فقط)

#### ب. Database User

1. اذهب إلى **"Database Access"**
2. تأكد من وجود Database User
3. تأكد من أن Username و Password صحيحة

---

### الخطوة 4: اختبر الاتصال

```bash
cd backend
node server.js
```

**يجب أن ترى:**
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Server running in development mode on port 5000
```

**إذا ظهر خطأ:**
- ✅ تحقق من أن رابط MongoDB صحيح
- ✅ تحقق من أن Username و Password صحيحة
- ✅ تحقق من أن IP Address موجود في Network Access
- ✅ تحقق من أن Cluster يعمل (Status: Running)

---

## 🔍 أمثلة على أخطاء شائعة

### ❌ خطأ 1: رابط غير صحيح
```
MONGODB_URI=mongodb+srv://cluster.mongodb.net/cleaning-service
```
**المشكلة:** الرابط غير مكتمل - يفتقد username و password و cluster ID

### ❌ خطأ 2: استخدام `<username>` و `<password>` كما هما
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cleaning-service
```
**المشكلة:** يجب استبدال `<username>` و `<password>` بقيم حقيقية

### ❌ خطأ 3: نسيان اسم قاعدة البيانات
```
MONGODB_URI=mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net
```
**المشكلة:** يجب إضافة `/cleaning-service` قبل `?`

---

## ✅ رابط صحيح - مثال كامل

```
MONGODB_URI=mongodb+srv://admin:mypassword123@cluster0.abc123.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

**شرح الأجزاء:**
- `mongodb+srv://` - البروتوكول
- `admin` - Username
- `mypassword123` - Password
- `cluster0.abc123.mongodb.net` - Cluster URL
- `cleaning-service` - اسم قاعدة البيانات
- `?retryWrites=true&w=majority` - خيارات الاتصال

---

## 📞 إذا استمرت المشكلة

1. ✅ تحقق من أن MongoDB Atlas Cluster يعمل (Status: Running)
2. ✅ تحقق من أن Internet Connection يعمل
3. ✅ جرب نسخ الرابط مرة أخرى من MongoDB Atlas
4. ✅ تأكد من عدم وجود مسافات إضافية في ملف `.env`
5. ✅ تأكد من أن Password لا تحتوي على رموز خاصة تحتاج إلى encoding (مثل `@`, `#`, `%`)

**إذا كان Password يحتوي على رموز خاصة:**
- استبدل `@` بـ `%40`
- استبدل `#` بـ `%23`
- استبدل `%` بـ `%25`

---

## 🎯 بعد إصلاح المشكلة

بعد أن يعمل الاتصال بنجاح، ستحتاج إلى:

1. ✅ إنشاء مستخدم Admin في MongoDB
2. ✅ تشغيل Backend و Frontend
3. ✅ اختبار تسجيل الدخول
4. ✅ اختبار إرسال بيانات من الصفحة الرئيسية

**راجع:** `SYSTEM_STATUS.md` للخطوات الكاملة

