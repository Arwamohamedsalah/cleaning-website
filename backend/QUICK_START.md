# 🚀 دليل البدء السريع

## الخطوة 1: إنشاء ملف .env

### Windows:
```powershell
cd backend
copy ENV_TEMPLATE.txt .env
```

### Linux/Mac:
```bash
cd backend
cp ENV_TEMPLATE.txt .env
```

## الخطوة 2: تحديث ملف .env

افتح ملف `.env` وحدّث:

1. **MONGODB_URI**: ضع رابط MongoDB Atlas الخاص بك
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority
   ```

2. **JWT_SECRET**: ضع سلسلة عشوائية قوية
   ```
   JWT_SECRET=your_super_secret_key_here
   ```

3. **ADMIN_EMAIL** و **ADMIN_PASSWORD**: بيانات تسجيل الدخول
   ```
   ADMIN_EMAIL=admin@cleaning.com
   ADMIN_PASSWORD=admin123
   ```

## الخطوة 3: تثبيت المكتبات

```bash
cd backend
npm install
```

## الخطوة 4: إنشاء حساب Admin

```bash
npm run create-admin
```

ستظهر لك بيانات تسجيل الدخول.

## الخطوة 5: تشغيل السيرفر

```bash
npm run dev
```

السيرفر سيعمل على: `http://localhost:5000`

## الخطوة 6: تسجيل الدخول

استخدم بيانات Admin من الخطوة 4.

---

## ✅ التحقق من الاتصال

```bash
npm run test:db
```

إذا ظهرت رسالة `✅ MongoDB Connected`، فكل شيء يعمل بشكل صحيح!

