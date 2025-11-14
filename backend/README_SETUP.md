# دليل الإعداد السريع

## 1. إعداد ملف .env

انسخ ملف `.env.example` إلى `.env`:

```bash
cd backend
copy .env.example .env
```

أو على Linux/Mac:
```bash
cp .env.example .env
```

## 2. تحديث ملف .env

افتح ملف `.env` وحدّث القيم التالية:

```env
# رابط MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority

# معلومات Admin
ADMIN_EMAIL=admin@cleaning.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin
ADMIN_PHONE=0500000000

# JWT Secret (استخدم سلسلة عشوائية قوية)
JWT_SECRET=your_super_secret_jwt_key_here
```

## 3. تثبيت المكتبات

```bash
cd backend
npm install
```

## 4. إنشاء حساب Admin

بعد تحديث ملف `.env`، قم بتشغيل:

```bash
npm run create-admin
```

سيتم إنشاء حساب Admin تلقائياً.

## 5. تشغيل السيرفر

```bash
npm run dev
```

السيرفر سيعمل على: `http://localhost:5000`

## 6. تسجيل الدخول

استخدم بيانات Admin التي أنشأتها:
- **Email**: القيمة من `ADMIN_EMAIL` في `.env`
- **Password**: القيمة من `ADMIN_PASSWORD` في `.env`

---

## ملاحظات مهمة:

1. **MongoDB Atlas**: تأكد من:
   - إضافة IP الخاص بك في Network Access
   - إنشاء Database User
   - نسخ Connection String بشكل صحيح

2. **JWT_SECRET**: استخدم سلسلة عشوائية قوية في الإنتاج

3. **ADMIN_PASSWORD**: غيّر كلمة المرور بعد أول تسجيل دخول

4. **البيئة**: في الإنتاج، غيّر `NODE_ENV=production`

