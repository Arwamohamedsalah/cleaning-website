# 🚀 رفع المشروع من GitHub على السيرفر

## 📍 معلومات المستودع

- **GitHub Repo**: https://github.com/Arwamohamedsalah/cleaning-website
- **VPS IP**: 72.61.94.71
- **Domain**: ardbk.com

---

## ⚡ الطريقة السريعة (أمر واحد)

### SSH إلى السيرفر ثم شغّل:

```bash
ssh root@72.61.94.71
```

### ثم:

```bash
cd /tmp && curl -o deploy.sh https://raw.githubusercontent.com/Arwamohamedsalah/cleaning-website/main/QUICK_DEPLOY_SERVER.sh && chmod +x deploy.sh && bash deploy.sh
```

---

## 📝 الخطوات التفصيلية

### 1. الاتصال بالسيرفر

```bash
ssh root@72.61.94.71
```

### 2. تحميل وتشغيل Script

```bash
cd /tmp
curl -o deploy.sh https://raw.githubusercontent.com/Arwamohamedsalah/cleaning-website/main/QUICK_DEPLOY_SERVER.sh
chmod +x deploy.sh
bash deploy.sh
```

### 3. تعديل ملف .env

```bash
nano /var/www/cleaning/backend/.env
```

**عدّل:**
- `MONGODB_URI` - رابط MongoDB Atlas
- `JWT_SECRET` - مفتاح قوي
- `FRONTEND_URL=https://ardbk.com`
- `PORT=3000`
- `NODE_ENV=production`

### 4. إعادة تشغيل Backend

```bash
pm2 restart cleaning-backend
```

---

## 🔄 تحديث المشروع لاحقاً

```bash
cd /var/www/cleaning
git pull origin main
npm run build
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/
pm2 restart cleaning-backend
```

---

## ✅ التحقق

- **الموقع**: https://ardbk.com
- **API**: https://ardbk.com/api/health

---

**المستودع**: https://github.com/Arwamohamedsalah/cleaning-website

