# ⚡ رفع سريع من GitHub إلى Hostinger

## 🎯 الطريقة السريعة (5 دقائق)

### 1️⃣ إعداد GitHub Secrets

1. اذهب إلى GitHub Repository
2. **Settings** > **Secrets and variables** > **Actions**
3. اضغط **New repository secret**
4. أضف:

```
HOSTINGER_FTP_HOST=ftp.ardbk.com
HOSTINGER_FTP_USER=your-username
HOSTINGER_FTP_PASS=your-password
HOSTINGER_DEPLOY_PATH=/home/username/public_html
```

### 2️⃣ Push إلى GitHub

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### 3️⃣ التحقق

- اذهب إلى **Actions** tab في GitHub
- ستجد workflow "Deploy to Hostinger" يعمل
- انتظر حتى يكتمل
- افتح `https://ardbk.com`

---

## ✅ جاهز!

كل push جديد سيُرفع تلقائياً! 🚀

---

**للمزيد من التفاصيل**: راجع `GITHUB_DEPLOYMENT.md`

