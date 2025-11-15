# 📋 خطوات رفع المشروع على VPS - خطوة بخطوة

## 🎯 معلومات الخادم

- **VPS IP**: 72.61.94.71
- **Domain**: ardbk.com
- **GitHub Repo**: https://github.com/Arwamohamedsalah/cleaning-website.git

---

## 🚀 الطريقة السريعة (Script تلقائي)

### الخطوة 1: SSH إلى VPS

```bash
ssh root@72.61.94.71
```

### الخطوة 2: رفع وتشغيل Script

**الطريقة أ**: رفع الملف ثم تشغيله
```bash
# رفع EXECUTE_ON_VPS.sh إلى VPS (استخدم SCP أو File Manager)
chmod +x EXECUTE_ON_VPS.sh
./EXECUTE_ON_VPS.sh
```

**الطريقة ب**: نسخ المحتوى مباشرة
```bash
# انسخ محتوى EXECUTE_ON_VPS.sh
# الصقه في VPS باستخدام nano أو vi
nano deploy.sh
# الصق المحتوى، احفظ (Ctrl+X, Y, Enter)
chmod +x deploy.sh
./deploy.sh
```

### الخطوة 3: تعديل ملف .env

```bash
nano /var/www/cleaning/backend/.env
```

**عدّل القيم التالية:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://ardbk.com
JWT_SECRET=your_very_strong_secret_key_here
```

### الخطوة 4: إعادة تشغيل Backend

```bash
pm2 restart cleaning-backend
```

---

## 🛠️ الطريقة اليدوية (خطوة بخطوة)

### 1. الاتصال بـ VPS

```bash
ssh root@72.61.94.71
```

### 2. تثبيت Git

```bash
apt-get update
apt-get install -y git
```

### 3. تثبيت Node.js 18

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
node --version  # يجب أن يظهر v18.x.x
```

### 4. تثبيت PM2

```bash
npm install -g pm2
```

### 5. استنساخ المشروع

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/Arwamohamedsalah/cleaning-website.git cleaning
cd cleaning
```

### 6. إعداد Backend

```bash
cd backend
npm install --production

# إنشاء ملف .env
cp HOSTINGER_ENV.txt .env
nano .env  # عدّل القيم المطلوبة
```

### 7. بناء Frontend

```bash
cd /var/www/cleaning
npm install --production
npm run build
```

### 8. نقل Frontend Build

```bash
mkdir -p /var/www/client
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/
chown -R www-data:www-data /var/www/client
chmod -R 755 /var/www/client
```

### 9. تثبيت Nginx

```bash
apt-get install -y nginx
```

### 10. إعداد Nginx

```bash
# إنشاء ملف التكوين
nano /etc/nginx/sites-available/ardbk.com
```

**الصق المحتوى التالي:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name ardbk.com www.ardbk.com;

    root /var/www/client;
    index index.html;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**تفعيل الموقع:**
```bash
ln -s /etc/nginx/sites-available/ardbk.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t  # اختبار التكوين
systemctl restart nginx
```

### 11. تشغيل Backend مع PM2

```bash
cd /var/www/cleaning/backend
pm2 start server.js --name cleaning-backend --env production
pm2 save
pm2 startup systemd -u root --hp /root
# اتبع التعليمات التي تظهر
```

### 12. تفعيل HTTPS

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d ardbk.com -d www.ardbk.com --non-interactive --agree-tos --email admin@ardbk.com --redirect
```

---

## ✅ التحقق من الإعداد

### 1. Backend Health Check

```bash
curl http://localhost:3000/api/health
```

**يجب أن ترى:**
```json
{"success":true,"message":"Server is running"}
```

### 2. PM2 Status

```bash
pm2 status
pm2 logs cleaning-backend
```

### 3. Nginx Status

```bash
systemctl status nginx
```

### 4. الموقع

افتح المتصفح:
- `https://ardbk.com` - يجب أن يفتح الموقع
- `https://ardbk.com/api/health` - يجب أن يرجع JSON

---

## 🔄 تحديث المشروع

```bash
cd /var/www/cleaning
git pull origin main
npm run build
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/
pm2 restart cleaning-backend
```

---

## 🐛 حل المشاكل

### Backend لا يعمل
```bash
pm2 logs cleaning-backend
cat /var/www/cleaning/backend/.env
```

### Nginx Error
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### SSL Issues
```bash
certbot renew --dry-run
```

---

## 📝 Checklist

- [ ] Git مثبت
- [ ] Node.js 18 مثبت
- [ ] PM2 مثبت
- [ ] Nginx مثبت
- [ ] Repository مستنسخ
- [ ] ملف .env معدّ
- [ ] Frontend مبني
- [ ] Nginx معدّ
- [ ] Backend يعمل مع PM2
- [ ] SSL مفعّل
- [ ] الموقع يعمل على https://ardbk.com

---

**للمساعدة**: راجع `VPS_DEPLOYMENT_GUIDE.md` للتفاصيل الكاملة.

