# 🚀 رفع المشروع على السيرفر - الآن!

## ⚡ الطريقة السريعة

### الخطوة 1: SSH إلى السيرفر

```bash
ssh root@72.61.94.71
```

### الخطوة 2: تشغيل Script التلقائي

**الطريقة أ: نسخ Script مباشرة**

```bash
cd /tmp
curl -o deploy.sh https://raw.githubusercontent.com/Arwamohamedsalah/cleaning-website/main/QUICK_DEPLOY_SERVER.sh
chmod +x deploy.sh
bash deploy.sh
```

**الطريقة ب: استنساخ المشروع ثم تشغيل Script**

```bash
# استنساخ المشروع
cd /var/www
git clone https://github.com/Arwamohamedsalah/cleaning-website.git cleaning
cd cleaning

# جعل Script قابل للتنفيذ
chmod +x EXECUTE_ON_VPS.sh

# تشغيل Script
./EXECUTE_ON_VPS.sh
```

---

## 📝 الخطوات اليدوية (إذا لم يعمل Script)

### 1. تثبيت المتطلبات

```bash
apt-get update
apt-get install -y git nodejs npm nginx
npm install -g pm2
```

### 2. استنساخ المشروع

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/Arwamohamedsalah/cleaning-website.git cleaning
cd cleaning
```

### 3. إعداد Backend

```bash
cd backend
npm install --production

# إنشاء ملف .env
cp HOSTINGER_ENV.txt .env
nano .env  # عدّل القيم المطلوبة
```

**عدّل في ملف .env:**
- `MONGODB_URI` - رابط MongoDB Atlas
- `JWT_SECRET` - مفتاح قوي
- `FRONTEND_URL=https://ardbk.com`
- `PORT=3000`
- `NODE_ENV=production`

### 4. بناء Frontend

```bash
cd /var/www/cleaning
npm install --production
npm run build
```

### 5. نقل Frontend Build

```bash
mkdir -p /var/www/client
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/
chown -R www-data:www-data /var/www/client
chmod -R 755 /var/www/client
```

### 6. إعداد Nginx

```bash
# نسخ ملف التكوين
cp nginx-config.conf /etc/nginx/sites-available/ardbk.com

# تفعيل الموقع
ln -s /etc/nginx/sites-available/ardbk.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# اختبار وإعادة تشغيل
nginx -t
systemctl restart nginx
```

### 7. تشغيل Backend مع PM2

```bash
cd /var/www/cleaning/backend
pm2 start server.js --name cleaning-backend --env production
pm2 save
pm2 startup systemd -u root --hp /root
```

### 8. تفعيل HTTPS

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d ardbk.com -d www.ardbk.com --non-interactive --agree-tos --email admin@ardbk.com --redirect
```

---

## ✅ التحقق من الإعداد

```bash
# تحقق من Backend
curl http://localhost:3000/api/health

# تحقق من PM2
pm2 status

# تحقق من Nginx
systemctl status nginx
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

---

**بعد الرفع، الموقع سيعمل على: https://ardbk.com**

