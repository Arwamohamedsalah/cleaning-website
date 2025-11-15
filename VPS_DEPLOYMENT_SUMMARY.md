# ✅ ملفات رفع VPS - جاهزة للاستخدام

## 📁 الملفات المُنشأة

### Scripts للتنفيذ على VPS:
1. **`EXECUTE_ON_VPS.sh`** ⭐ - Script كامل للتنفيذ على VPS (استخدم هذا!)
2. **`quick-deploy-vps.sh`** - Script سريع
3. **`deploy-vps.sh`** - Script مفصل

### ملفات التكوين:
4. **`nginx-config.conf`** - تكوين Nginx
5. **`pm2-ecosystem.config.js`** - تكوين PM2

### ملفات التوثيق:
6. **`START_HERE_VPS.md`** ⭐ - ابدأ من هنا!
7. **`STEP_BY_STEP_VPS.md`** - دليل خطوة بخطوة
8. **`VPS_DEPLOYMENT_GUIDE.md`** - دليل شامل
9. **`DEPLOYMENT_REPORT_TEMPLATE.md`** - قالب تقرير الرفع

---

## 🚀 كيفية الاستخدام

### الطريقة 1: Script تلقائي (مُوصى به)

```bash
# 1. SSH إلى VPS
ssh root@72.61.94.71

# 2. رفع EXECUTE_ON_VPS.sh إلى VPS
# (استخدم SCP أو File Manager)

# 3. تشغيل Script
chmod +x EXECUTE_ON_VPS.sh
./EXECUTE_ON_VPS.sh

# 4. تعديل .env
nano /var/www/cleaning/backend/.env

# 5. إعادة تشغيل
pm2 restart cleaning-backend
```

### الطريقة 2: يدوي

اتبع الخطوات في `STEP_BY_STEP_VPS.md`

---

## 📋 ما يقوم به Script

1. ✅ يثبت Git, Node.js 18, PM2, Nginx
2. ✅ يستنسخ/يحدّث المشروع من GitHub
3. ✅ يثبت Dependencies
4. ✅ يبني Frontend
5. ✅ ينقل Build إلى `/var/www/client`
6. ✅ يعدّ Nginx
7. ✅ يشغّل Backend مع PM2
8. ✅ يفعل HTTPS مع Let's Encrypt

---

## ⚠️ مهم جداً

**بعد تشغيل Script، يجب:**

1. **تعديل ملف .env:**
   ```bash
   nano /var/www/cleaning/backend/.env
   ```
   
   **عدّل:**
   - `MONGODB_URI` - رابط MongoDB Atlas
   - `JWT_SECRET` - مفتاح قوي
   - `FRONTEND_URL=https://ardbk.com`
   - `PORT=3000`
   - `NODE_ENV=production`

2. **إضافة IP VPS إلى MongoDB Atlas Whitelist:**
   - اذهب إلى MongoDB Atlas
   - Network Access > Add IP Address
   - أضف: `72.61.94.71`

3. **إعادة تشغيل Backend:**
   ```bash
   pm2 restart cleaning-backend
   ```

---

## ✅ التحقق

بعد الإعداد:

- **Frontend**: https://ardbk.com
- **Backend API**: https://ardbk.com/api
- **Health Check**: https://ardbk.com/api/health

---

## 📝 ملاحظات

- جميع الملفات موجودة على GitHub
- Scripts جاهزة للاستخدام
- اتبع `START_HERE_VPS.md` للبدء السريع

---

**جاهز للرفع! 🚀**

