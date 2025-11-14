# 🚀 نظام الرفع التلقائي من GitHub إلى Hostinger

## ✅ تم إعداد كل شيء!

يمكنك الآن رفع المشروع على Hostinger تلقائياً من GitHub! 🎉

---

## 🎯 طريقتان للرفع

### 1️⃣ GitHub Actions (تلقائي) ⭐ مُوصى به

**عند push إلى GitHub، سيتم الرفع تلقائياً!**

#### الخطوات:

1. **إعداد Secrets في GitHub:**
   - اذهب إلى Repository > **Settings** > **Secrets and variables** > **Actions**
   - أضف:
     - `HOSTINGER_FTP_HOST`
     - `HOSTINGER_FTP_USER`
     - `HOSTINGER_FTP_PASS`
     - `HOSTINGER_DEPLOY_PATH`

2. **Push إلى GitHub:**
   ```bash
   git push origin main
   ```

3. **التحقق:**
   - اذهب إلى **Actions** tab
   - ستجد workflow يعمل تلقائياً

**✅ جاهز! كل push جديد سيُرفع تلقائياً!**

---

### 2️⃣ Deployment Script (يدوي)

**للرفع من جهازك مباشرة**

#### الخطوات:

1. **إعداد ملف التكوين:**
   ```bash
   cp deploy.config.json.example deploy.config.json
   # عدّل الملف بالقيم الصحيحة
   ```

2. **تشغيل الرفع:**
   ```bash
   node deploy.js
   ```

---

## 📁 الملفات المهمة

- `.github/workflows/deploy-hostinger.yml` - GitHub Actions workflow
- `deploy.js` - Deployment script
- `deploy.config.json.example` - مثال للتكوين
- `GITHUB_DEPLOYMENT.md` - دليل شامل
- `QUICK_GITHUB_DEPLOY.md` - دليل سريع

---

## 🔐 الأمان

- ✅ `deploy.config.json` في `.gitignore` (لن يُرفع)
- ✅ استخدم GitHub Secrets للبيانات الحساسة
- ✅ لا تضع كلمات المرور في الكود

---

## 📝 الحصول على بيانات Hostinger

### FTP/SFTP:
1. Hostinger Panel > **FTP Accounts**
2. ستجد Host, Username, Password

### Deploy Path:
عادة: `/home/username/public_html` أو `/home/username/domains/ardbk.com/public_html`

---

## 🎉 كيف يعمل؟

### عند Push إلى GitHub:

1. ✅ GitHub Actions يبدأ تلقائياً
2. ✅ يبني Frontend (`npm run build`)
3. ✅ يرفع الملفات إلى Hostinger
4. ✅ يبني على السيرفر
5. ✅ يعيد تشغيل Node.js App

### النتيجة:
- **الموقع**: `https://ardbk.com` محدّث تلقائياً! 🚀

---

## 📚 ابدأ من هنا

**للمبتدئين**: اقرأ `QUICK_GITHUB_DEPLOY.md`

**للإعداد الكامل**: اقرأ `GITHUB_DEPLOYMENT.md`

---

## ✅ Checklist

- [ ] GitHub Secrets معدّة
- [ ] `deploy.config.json` معدّ (للرفع اليدوي)
- [ ] FTP credentials صحيحة
- [ ] Deploy path صحيح
- [ ] `.env` موجود على السيرفر

---

## 🎯 الخطوات التالية

1. **إعداد GitHub Secrets** (5 دقائق)
2. **Push إلى GitHub** (1 دقيقة)
3. **التحقق من Actions** (2 دقيقة)

**✅ جاهز! كل تعديل على GitHub سيُرفع تلقائياً!**

---

**للمساعدة**: راجع `GITHUB_DEPLOYMENT.md` للتفاصيل الكاملة.

