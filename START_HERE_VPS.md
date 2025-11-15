# 🚀 ابدأ من هنا - رفع المشروع على VPS

## ⚡ الطريقة الأسرع (5 دقائق)

### 1️⃣ SSH إلى VPS

```bash
ssh root@72.61.94.71
```

### 2️⃣ تشغيل Script التلقائي

**انسخ والصق هذا الأمر:**

```bash
cd /tmp && curl -o deploy.sh https://raw.githubusercontent.com/Arwamohamedsalah/cleaning-website/main/EXECUTE_ON_VPS.sh && chmod +x deploy.sh && bash deploy.sh
```

**أو:**

```bash
# إذا كان Script موجود محلياً
# ارفع EXECUTE_ON_VPS.sh إلى VPS ثم:
chmod +x EXECUTE_ON_VPS.sh
./EXECUTE_ON_VPS.sh
```

### 3️⃣ تعديل ملف .env

```bash
nano /var/www/cleaning/backend/.env
```

**عدّل:**
- `MONGODB_URI` - رابط MongoDB Atlas
- `JWT_SECRET` - مفتاح قوي
- `FRONTEND_URL=https://ardbk.com`
- `PORT=3000`
- `NODE_ENV=production`

### 4️⃣ إعادة تشغيل

```bash
pm2 restart cleaning-backend
```

---

## ✅ التحقق

- **الموقع**: https://ardbk.com
- **API**: https://ardbk.com/api/health

---

## 📚 الملفات المهمة

- `EXECUTE_ON_VPS.sh` - Script للتنفيذ على VPS
- `STEP_BY_STEP_VPS.md` - دليل خطوة بخطوة
- `VPS_DEPLOYMENT_GUIDE.md` - دليل شامل

---

**ملاحظة**: المستودع انتقل إلى: `https://github.com/Arwamohamedsalah/cleaning-website.git`

