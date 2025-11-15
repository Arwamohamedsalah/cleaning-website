# ⚡ رفع سريع على Hostinger من GitHub

## 🎯 الطريقة السريعة (3 خطوات)

### 1️⃣ استنساخ المشروع على Hostinger

**عبر SSH:**
```bash
ssh username@your-hostinger-ip
cd public_html
git clone https://github.com/Arwamohamedsalah/cleaning-website.git .
```

**أو عبر File Manager:**
1. استنسخ المشروع محلياً
2. ارفع جميع الملفات عبر FTP/File Manager

---

### 2️⃣ إعداد Backend

```bash
cd backend
npm install --production
cp HOSTINGER_ENV.txt .env
nano .env  # عدّل القيم المطلوبة
```

**في ملف `.env` عدّل:**
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL=https://ardbk.com`
- `DISABLE_PUPPETEER=true` (مهم للـ Shared Hosting)

---

### 3️⃣ بناء وتشغيل

```bash
# بناء Frontend
cd ..
npm install --production
npm run build

# تشغيل Backend (عبر Hostinger Node.js Panel)
# أو عبر PM2 (إذا كان VPS)
cd backend
pm2 start server.js --name cleaning-backend
```

---

## 📝 إعداد Node.js في Hostinger Panel

1. اذهب إلى **Hostinger Panel** > **Node.js**
2. أنشئ تطبيق جديد:
   - **Application Root**: `backend/`
   - **Application URL**: `ardbk.com`
   - **Startup File**: `server.js`
   - **Node.js Version**: 18.x

---

## ✅ التحقق

- Frontend: `https://ardbk.com`
- Backend: `https://ardbk.com/api/health`

---

**للمزيد من التفاصيل**: راجع `DEPLOY_TO_HOSTINGER_FROM_GITHUB.md`

