# 🚀 VPS Deployment - Quick Start

## ⚡ الطريقة السريعة (5 دقائق)

### 1. SSH إلى VPS

```bash
ssh root@72.61.94.71
```

### 2. رفع وتشغيل Script

```bash
# رفع quick-deploy-vps.sh إلى VPS (استخدم SCP أو File Manager)
# ثم:
chmod +x quick-deploy-vps.sh
./quick-deploy-vps.sh
```

### 3. تعديل ملف .env

```bash
nano /var/www/cleaning/backend/.env
```

**عدّل:**
- `MONGODB_URI` - رابط MongoDB Atlas
- `JWT_SECRET` - مفتاح قوي
- `FRONTEND_URL` - https://ardbk.com

### 4. إعادة تشغيل Backend

```bash
pm2 restart cleaning-backend
```

---

## ✅ التحقق

- **الموقع**: https://ardbk.com
- **API**: https://ardbk.com/api/health

---

**للمزيد من التفاصيل**: راجع `VPS_DEPLOYMENT_GUIDE.md`

