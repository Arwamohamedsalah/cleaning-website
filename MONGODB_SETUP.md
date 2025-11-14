# دليل إعداد MongoDB Atlas 🔗

## خطوات الحصول على رابط قاعدة البيانات

### 1️⃣ إنشاء حساب MongoDB Atlas

1. اذهب إلى: https://www.mongodb.com/cloud/atlas
2. سجّل حساب جديد (مجاني)
3. اختر Free tier (M0)

### 2️⃣ إنشاء Cluster

1. بعد تسجيل الدخول، اضغط **"Build a Database"**
2. اختر **FREE** (M0 Sandbox)
3. اختر Cloud Provider و Region (مثلاً: AWS, Frankfurt)
4. اضغط **"Create"**
5. انتظر حتى يتم إنشاء Cluster (5-10 دقائق)

### 3️⃣ إنشاء Database User

1. في الشاشة الرئيسية، اضغط **"Database Access"** من القائمة الجانبية
2. اضغط **"Add New Database User"**
3. اختر **"Password"** authentication
4. أدخل:
   - **Username:** (مثلاً: `admin` أو `cleaning-admin`)
   - **Password:** (مثلاً: `MySecurePassword123!`)
   - **Database User Privileges:** Atlas admin
5. اضغط **"Add User"**
6. **احفظ Username و Password** - ستحتاجهم!

### 4️⃣ إضافة IP Address

1. اضغط **"Network Access"** من القائمة الجانبية
2. اضغط **"Add IP Address"**
3. للـ development:
   - اضغط **"Allow Access from Anywhere"**
   - أو أدخل `0.0.0.0/0`
4. اضغط **"Confirm"**

### 5️⃣ الحصول على Connection String

1. اضغط **"Database"** من القائمة الجانبية
2. اضغط **"Connect"** على Cluster الخاص بك
3. اختر **"Connect your application"**
4. اختر **"Node.js"** و Version **"5.5 or later"**
5. انسخ Connection String

سيكون شكله هكذا:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6️⃣ تعديل Connection String

استبدل:
- `<username>` → بالـ username الذي أنشأته (مثلاً: `admin`)
- `<password>` → بكلمة المرور (مثلاً: `MySecurePassword123!`)
- أضف اسم قاعدة البيانات قبل `?`:
  ```
  mongodb+srv://admin:MySecurePassword123!@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
  ```

### 7️⃣ إضافة الرابط في المشروع

1. في مجلد `backend`، أنشئ ملف `.env`
2. أضف الرابط:

```env
MONGODB_URI=mongodb+srv://admin:MySecurePassword123!@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

**مثال كامل لملف `.env`:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://admin:MySecurePassword123!@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-12345
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 8️⃣ اختبار الاتصال

```bash
cd backend
npm run test:db
```

إذا رأيت:
```
✅ MongoDB Connected: ...
✅ Database: cleaning-service
✅ Connection test completed successfully!
```

يعني الاتصال نجح! 🎉

## ⚠️ ملاحظات مهمة

1. **لا تشارك رابط قاعدة البيانات** مع أحد
2. **لا ترفع ملف `.env`** على GitHub
3. **استخدم كلمة مرور قوية** للـ Database User
4. **في Production:** قيّد IP Address بدلاً من `0.0.0.0/0`

## 🔒 الأمان

- احفظ ملف `.env` في `.gitignore`
- لا تضع معلومات حساسة في الكود
- استخدم متغيرات بيئة مختلفة للـ Production

## 📝 مثال على ملف `.env` كامل

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority

# JWT
JWT_SECRET=change-this-to-random-string-in-production
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🆘 مشاكل شائعة

### "Authentication failed"
- تأكد من أن Username و Password صحيحين
- تأكد من استبدال `<username>` و `<password>` في الرابط

### "IP not whitelisted"
- تأكد من إضافة IP Address في Network Access
- استخدم `0.0.0.0/0` للـ development

### "Connection timeout"
- تأكد من أن Cluster يعمل (Status: Running)
- تأكد من صحة Connection String

