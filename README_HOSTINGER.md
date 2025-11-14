# 🚀 المشروع جاهز للرفع على Hostinger - ardbk.com

## ✅ تم إعداد كل شيء!

المشروع معدّ بالكامل للرفع على Hostinger. جميع الملفات والإعدادات جاهزة.

---

## 📁 الملفات المهمة

### ملفات الإعداد:
- `backend/HOSTINGER_ENV.txt` - قالب ملف `.env` للإنتاج
- `.htaccess` - إعدادات Apache لـ Hostinger
- `backend/server.js` - معدّ لـ Hostinger (Port 3000)

### ملفات التوثيق:
- `HOSTINGER_DEPLOYMENT.md` - **دليل شامل ومفصل** (ابدأ من هنا!)
- `QUICK_DEPLOY_HOSTINGER.md` - دليل سريع (5 دقائق)
- `HOSTINGER_SETUP_COMPLETE.md` - ملخص الإعداد

---

## 🎯 الخطوات السريعة

### 1. إعداد ملف .env على Hostinger

```bash
# في Hostinger File Manager
# 1. اذهب إلى backend/
# 2. أنشئ ملف .env
# 3. انسخ محتوى backend/HOSTINGER_ENV.txt
# 4. عدّل القيم المطلوبة
```

### 2. رفع الملفات

ارفع جميع ملفات المشروع إلى Hostinger

### 3. بناء وتشغيل

```bash
npm install
cd backend && npm install && cd ..
npm run build
```

ثم في Hostinger Node.js Panel:
- **App Root**: `/backend`
- **Start Command**: `node server.js`
- **Port**: `3000`

---

## 📝 ملف .env المطلوب

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://ardbk.com
JWT_SECRET=YOUR_STRONG_SECRET_KEY
ADMIN_PASSWORD=YOUR_STRONG_PASSWORD
```

---

## 🔗 الروابط بعد الرفع

- **الموقع**: `https://ardbk.com`
- **API**: `https://ardbk.com/api`
- **Health Check**: `https://ardbk.com/api/health`

---

## 📚 ابدأ من هنا

**للمبتدئين**: اقرأ `QUICK_DEPLOY_HOSTINGER.md`

**للإعداد الكامل**: اقرأ `HOSTINGER_DEPLOYMENT.md`

---

## ✅ Checklist

- [x] ملف .env template جاهز
- [x] Server.js معدّ لـ Hostinger
- [x] CORS معدّ للدومين
- [x] Static files serving معدّ
- [x] .htaccess جاهز
- [x] API Base URL معدّ للإنتاج
- [x] توثيق شامل

---

## 🎉 جاهز للرفع!

اتبع الخطوات في `HOSTINGER_DEPLOYMENT.md` وستكون جاهزاً خلال 15 دقيقة!

