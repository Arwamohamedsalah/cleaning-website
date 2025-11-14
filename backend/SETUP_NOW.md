# ⚡ إعداد سريع - اتبع هذه الخطوات

## الخطوة 1: إنشاء ملف .env

افتح PowerShell في مجلد `backend` واكتب:

```powershell
Copy-Item ENV_TEMPLATE.txt .env
```

## الخطوة 2: تحديث ملف .env

افتح ملف `.env` وحدّث السطر التالي برابط MongoDB Atlas الخاص بك:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

**مثال:**
```env
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

## الخطوة 3: تحديث JWT_SECRET

في نفس ملف `.env`، حدّث:

```env
JWT_SECRET=any_random_string_here_123456
```

## الخطوة 4: إنشاء Admin

بعد تحديث `.env`، شغّل:

```powershell
npm run create-admin
```

## الخطوة 5: تشغيل السيرفر

```powershell
npm run dev
```

---

## 🔍 كيفية الحصول على MongoDB URI:

1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. سجّل الدخول أو أنشئ حساب
3. أنشئ Cluster جديد (Free)
4. اضغط **Connect** > **Connect your application**
5. انسخ Connection String
6. استبدل `<password>` بكلمة مرور Database User
7. استبدل `<dbname>` بـ `cleaning-service`

---

## ✅ التحقق من الاتصال:

```powershell
npm run test:db
```

إذا ظهرت `✅ MongoDB Connected`، فكل شيء يعمل!

