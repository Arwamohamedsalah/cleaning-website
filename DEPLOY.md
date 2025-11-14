# 🚀 رفع المشروع على ardbk.com - دليل سريع

## ⚡ خطوات سريعة

### 1. إعداد Backend

```bash
cd backend
cp ENV_TEMPLATE.txt .env
```

عدّل ملف `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://ardbk.com
JWT_SECRET=your_strong_secret_key
```

### 2. بناء Frontend

```bash
npm run build
```

### 3. تشغيل Production

```bash
cd backend
npm run prod
```

الموقع سيعمل على: `http://ardbk.com:3001`

## 📌 ملاحظات مهمة

- ✅ كل شيء يعمل على نفس البورت (3001)
- ✅ API: `http://ardbk.com:3001/api`
- ✅ Frontend: `http://ardbk.com:3001`
- ✅ CORS مُعد للدومين ardbk.com
- ✅ في Production، API Base URL = `/api` (نفس الدومين)

## 🔄 عند التحديث

```bash
npm run build
cd backend
pm2 restart cleaning-backend
# أو
npm run prod
```

