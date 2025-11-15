# ⚡ إنشاء ملف .env للإنتاج - الآن!

## 🚀 الطريقة السريعة

### على Windows (PowerShell):

```powershell
cd backend
Copy-Item HOSTINGER_ENV.txt .env
```

### على Linux/Mac:

```bash
cd backend
cp HOSTINGER_ENV.txt .env
```

---

## 📝 محتوى ملف .env للإنتاج

بعد النسخ، ملف `.env` سيكون:

```env
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://ardbk.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service
JWT_SECRET=CHANGE_THIS_TO_A_VERY_STRONG_RANDOM_SECRET_KEY
ADMIN_EMAIL=admin@ardbk.com
ADMIN_PASSWORD=CHANGE_THIS_PASSWORD_TO_SOMETHING_STRONG
```

---

## ✅ بعد النسخ

1. **عدّل ملف .env:**
   - `MONGODB_URI` - رابط MongoDB Atlas
   - `JWT_SECRET` - مفتاح قوي
   - `ADMIN_PASSWORD` - كلمة مرور قوية

2. **أعد تشغيل Backend:**
   ```bash
   pm2 restart cleaning-backend
   # أو
   npm run prod
   ```

---

**ملاحظة**: ملف `.env` غير موجود في Git (محمي)

