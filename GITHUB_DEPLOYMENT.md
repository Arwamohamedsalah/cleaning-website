# 🚀 رفع تلقائي من GitHub إلى Hostinger

## 📋 نظرة عامة

يمكنك رفع المشروع على Hostinger تلقائياً من GitHub بطريقتين:

1. **GitHub Actions** - رفع تلقائي عند push
2. **Deployment Script** - رفع يدوي من جهازك

---

## 🔄 الطريقة 1: GitHub Actions (تلقائي)

### الخطوة 1: إعداد Secrets في GitHub

1. اذهب إلى GitHub Repository
2. اضغط **Settings** > **Secrets and variables** > **Actions**
3. اضغط **New repository secret**
4. أضف الأسرار التالية:

```
HOSTINGER_FTP_HOST=ftp.yourdomain.com
HOSTINGER_FTP_USER=your-username
HOSTINGER_FTP_PASS=your-password
HOSTINGER_DEPLOY_PATH=/home/username/public_html
HOSTINGER_SSH_HOST=your-ssh-host.com
HOSTINGER_SSH_USER=your-ssh-username
HOSTINGER_SSH_KEY=your-ssh-private-key
```

### الخطوة 2: تفعيل GitHub Actions

1. الملف `.github/workflows/deploy-hostinger.yml` موجود بالفعل
2. عند push إلى `main` branch، سيتم الرفع تلقائياً
3. يمكنك أيضاً تشغيله يدوياً من **Actions** tab

### الخطوة 3: التحقق من الرفع

1. اذهب إلى **Actions** tab في GitHub
2. ستجد workflow جديد اسمه "Deploy to Hostinger"
3. اضغط عليه لرؤية التقدم

---

## 🛠️ الطريقة 2: Deployment Script (يدوي)

### الخطوة 1: إعداد ملف التكوين

```bash
# انسخ الملف المثال
cp deploy.config.json.example deploy.config.json

# عدّل الملف بالقيم الصحيحة
nano deploy.config.json
```

### الخطوة 2: ملء بيانات Hostinger

```json
{
  "hostinger": {
    "host": "ftp.ardbk.com",
    "username": "your-username",
    "password": "your-password",
    "deployPath": "/home/username/public_html",
    "sshKey": "/path/to/ssh/key"
  }
}
```

### الخطوة 3: تشغيل الرفع

```bash
node deploy.js
```

---

## 📝 الحصول على بيانات Hostinger

### FTP/SFTP Credentials:

1. سجّل دخول إلى Hostinger Panel
2. اذهب إلى **FTP Accounts**
3. ستجد:
   - **Host**: عادة `ftp.yourdomain.com` أو IP
   - **Username**: اسم المستخدم
   - **Password**: كلمة المرور

### SSH Access:

1. في Hostinger Panel، اذهب إلى **SSH Access**
2. فعّل SSH إذا لم يكن مفعّل
3. أنشئ SSH Key أو استخدم Password
4. **Host**: عادة `ssh.yourdomain.com` أو IP
5. **Port**: عادة `22`

### Deploy Path:

عادة يكون أحد هذه المسارات:
- `/home/username/public_html`
- `/home/username/domains/ardbk.com/public_html`
- `/home/username/domains/ardbk.com/public_html`

---

## 🔐 الأمان

### ⚠️ مهم جداً:

1. **لا ترفع ملف `deploy.config.json` إلى GitHub**
   - الملف موجود في `.gitignore`
   - يحتوي على كلمات مرور حساسة

2. **استخدم GitHub Secrets** للبيانات الحساسة
   - لا تضع كلمات المرور في الكود
   - استخدم Secrets دائماً

3. **استخدم SSH Keys** بدلاً من Passwords
   - أكثر أماناً
   - أسهل في الاستخدام

---

## 🔄 سير العمل (Workflow)

### عند Push إلى GitHub:

1. ✅ GitHub Actions يبدأ تلقائياً
2. ✅ يبني Frontend (`npm run build`)
3. ✅ يرفع الملفات إلى Hostinger
4. ✅ يبني على السيرفر
5. ✅ يعيد تشغيل Node.js App

### عند استخدام Script:

1. ✅ يبني Frontend محلياً
2. ✅ يرفع الملفات عبر SFTP
3. ✅ يبني على السيرفر (إذا كان SSH متاح)
4. ✅ يعيد تشغيل التطبيق

---

## 🐛 حل المشاكل

### المشكلة 1: GitHub Actions فشل

**الحل:**
- تحقق من Secrets في GitHub
- تأكد من صحة بيانات FTP/SSH
- تحقق من Logs في Actions tab

### المشكلة 2: SFTP Connection Failed

**الحل:**
- تحقق من Host و Username و Password
- تأكد من أن FTP مفعّل في Hostinger
- جرب الاتصال يدوياً بـ FileZilla أولاً

### المشكلة 3: SSH Connection Failed

**الحل:**
- تأكد من تفعيل SSH في Hostinger
- تحقق من SSH Key
- جرب الاتصال يدوياً: `ssh username@host`

### المشكلة 4: Files Not Uploaded

**الحل:**
- تحقق من `deployPath` في التكوين
- تأكد من الصلاحيات على المجلد
- تحقق من Logs

---

## 📚 الملفات المهمة

- `.github/workflows/deploy-hostinger.yml` - GitHub Actions workflow
- `deploy.js` - Deployment script
- `deploy.config.json.example` - مثال للتكوين

---

## ✅ Checklist

- [ ] GitHub Secrets معدّة
- [ ] `deploy.config.json` معدّ (للرفع اليدوي)
- [ ] FTP/SFTP credentials صحيحة
- [ ] SSH access مفعّل (اختياري)
- [ ] Deploy path صحيح
- [ ] `.env` موجود على السيرفر

---

## 🎉 جاهز!

بعد الإعداد، كل push إلى `main` branch سيُرفع تلقائياً إلى Hostinger!

**للمساعدة**: راجع Logs في GitHub Actions أو تشغيل `node deploy.js` محلياً.

