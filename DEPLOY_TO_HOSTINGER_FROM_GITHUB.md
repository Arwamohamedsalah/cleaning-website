# 🚀 رفع المشروع على Hostinger من GitHub

## 📍 معلومات المشروع

- **GitHub Repo**: https://github.com/Arwamohamedsalah/cleaning-website
- **Domain**: ardbk.com
- **Hostinger**: Shared Hosting أو VPS

---

## ⚡ الطريقة السريعة (لـ VPS)

### الخطوة 1: SSH إلى Hostinger VPS

```bash
ssh root@your-vps-ip
# أو
ssh username@your-vps-ip
```

### الخطوة 2: استنساخ المشروع

```bash
cd /var/www
git clone https://github.com/Arwamohamedsalah/cleaning-website.git cleaning
cd cleaning
```

### الخطوة 3: تشغيل Script التلقائي

```bash
chmod +x QUICK_DEPLOY_SERVER.sh
./QUICK_DEPLOY_SERVER.sh
```

---

## 📝 الطريقة اليدوية (لـ Shared Hosting)

### الخطوة 1: استنساخ المشروع محلياً

```bash
git clone https://github.com/Arwamohamedsalah/cleaning-website.git
cd cleaning-website
```

### الخطوة 2: بناء Frontend

```bash
npm install
npm run build
```

### الخطوة 3: رفع الملفات عبر FTP/File Manager

**استخدم FileZilla أو File Manager في Hostinger:**

1. **Frontend Build:**
   - ارفع محتويات مجلد `dist/` إلى `public_html/` أو `htdocs/`

2. **Backend:**
   - ارفع مجلد `backend/` إلى `public_html/backend/` أو خارج `public_html/`

3. **ملفات التكوين:**
   - ارفع `.htaccess` إلى `public_html/`
   - ارفع `nginx-config.conf` (إذا كان VPS)

### الخطوة 4: إعداد Backend على Hostinger

#### أ. عبر File Manager:

1. اذهب إلى `public_html/backend/` أو `backend/`
2. أنشئ ملف `.env`
3. انسخ محتوى `HOSTINGER_ENV.txt` إلى `.env`
4. عدّل القيم المطلوبة

#### ب. عبر SSH:

```bash
cd public_html/backend
cp HOSTINGER_ENV.txt .env
nano .env
```

**عدّل في `.env`:**
- `MONGODB_URI` - رابط MongoDB Atlas
- `JWT_SECRET` - مفتاح قوي
- `FRONTEND_URL=https://ardbk.com`
- `PORT=3001` (أو البورت المحدد في Hostinger)
- `NODE_ENV=production`
- `DISABLE_PUPPETEER=true` (إذا كان Shared Hosting)

---

## 🔧 إعداد Node.js على Hostinger

### للـ Shared Hosting:

1. اذهب إلى **Hostinger Panel** > **Node.js**
2. أنشئ تطبيق Node.js جديد
3. حدد:
   - **Application Root**: `backend/`
   - **Application URL**: `ardbk.com`
   - **Application Startup File**: `server.js`
   - **Node.js Version**: 18.x أو أحدث

### للـ VPS:

```bash
# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# تثبيت PM2
npm install -g pm2

# تشغيل Backend
cd /var/www/cleaning/backend
npm install --production
pm2 start server.js --name cleaning-backend
pm2 save
```

---

## 📁 هيكل الملفات على Hostinger

### للـ Shared Hosting:

```
public_html/
├── index.html          (من dist/)
├── assets/             (من dist/)
├── img/                (من dist/)
├── .htaccess
└── backend/
    ├── server.js
    ├── .env
    ├── package.json
    └── [ملفات أخرى...]
```

### للـ VPS:

```
/var/www/
├── cleaning/           (المشروع الكامل)
│   ├── backend/
│   ├── dist/
│   └── ...
└── client/             (Frontend Build)
    ├── index.html
    └── assets/
```

---

## ⚙️ إعداد .htaccess (للـ Shared Hosting)

تأكد من وجود ملف `.htaccess` في `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔐 إعداد ملف .env على Hostinger

### للـ Shared Hosting:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://ardbk.com
JWT_SECRET=your_strong_secret_key
DISABLE_PUPPETEER=true
```

### للـ VPS:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://ardbk.com
JWT_SECRET=your_strong_secret_key
DISABLE_PUPPETEER=false
```

---

## 🚀 خطوات الرفع الكاملة

### الطريقة 1: عبر GitHub + SSH (VPS)

```bash
# 1. SSH إلى Hostinger
ssh root@your-vps-ip

# 2. استنساخ المشروع
cd /var/www
git clone https://github.com/Arwamohamedsalah/cleaning-website.git cleaning

# 3. إعداد Backend
cd cleaning/backend
npm install --production
cp HOSTINGER_ENV.txt .env
nano .env  # عدّل القيم

# 4. بناء Frontend
cd ..
npm install --production
npm run build

# 5. نقل Frontend
mkdir -p /var/www/client
cp -r dist/* /var/www/client/

# 6. تشغيل Backend
cd backend
pm2 start server.js --name cleaning-backend
```

### الطريقة 2: عبر FTP (Shared Hosting)

1. **استنساخ محلياً:**
   ```bash
   git clone https://github.com/Arwamohamedsalah/cleaning-website.git
   cd cleaning-website
   npm install
   npm run build
   ```

2. **رفع عبر FTP:**
   - Frontend: ارفع `dist/*` إلى `public_html/`
   - Backend: ارفع `backend/` إلى `public_html/backend/`
   - `.htaccess`: ارفع إلى `public_html/`

3. **إعداد Node.js في Hostinger Panel:**
   - أنشئ تطبيق Node.js
   - Application Root: `backend/`
   - Startup File: `server.js`

---

## ✅ التحقق من الإعداد

### 1. Frontend:
- افتح: `https://ardbk.com`
- يجب أن يفتح الموقع

### 2. Backend:
- افتح: `https://ardbk.com/api/health`
- يجب أن يرجع: `{"success":true,"message":"Server is running"}`

### 3. Logs:
```bash
# على VPS
pm2 logs cleaning-backend

# على Shared Hosting
# اذهب إلى Hostinger Panel > Node.js > Logs
```

---

## 🔄 تحديث المشروع لاحقاً

### على VPS:

```bash
cd /var/www/cleaning
git pull origin main
npm run build
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/
pm2 restart cleaning-backend
```

### على Shared Hosting:

1. استنساخ محلياً وتحديث
2. بناء Frontend
3. رفع الملفات عبر FTP
4. إعادة تشغيل Node.js من Hostinger Panel

---

## 🐛 حل المشاكل

### المشكلة: Backend لا يعمل

**الحل:**
- تحقق من `.env` في `backend/`
- تحقق من Logs في Hostinger Panel
- تأكد من أن Node.js Application يعمل

### المشكلة: Frontend لا يظهر

**الحل:**
- تحقق من وجود `.htaccess`
- تأكد من رفع جميع ملفات `dist/`
- تحقق من الصلاحيات (755 للمجلدات، 644 للملفات)

### المشكلة: Puppeteer Error

**الحل:**
- أضف `DISABLE_PUPPETEER=true` في `.env`
- هذا مهم للـ Shared Hosting

---

## 📝 Checklist قبل الرفع

- [ ] MongoDB URI صحيح
- [ ] JWT_SECRET قوي
- [ ] FRONTEND_URL صحيح
- [ ] DISABLE_PUPPETEER=true (للـ Shared Hosting)
- [ ] ملف .htaccess موجود
- [ ] Frontend مبني (`npm run build`)
- [ ] Backend dependencies مثبتة

---

**بعد الرفع، الموقع سيعمل على: https://ardbk.com**

