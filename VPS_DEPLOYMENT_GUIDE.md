# 🚀 دليل رفع المشروع على Hostinger VPS

## 📋 معلومات الخادم

- **VPS IP**: 72.61.94.71
- **Domain**: ardbk.com
- **Deploy Path**: /var/www/cleaning
- **Frontend Path**: /var/www/client

---

## 🔧 الطريقة 1: استخدام Script التلقائي (مُوصى به)

### الخطوة 1: رفع ملفات Deployment

ارفع الملفات التالية إلى VPS:
- `deploy-vps.sh`
- `nginx-config.conf`
- `pm2-ecosystem.config.js`

### الخطوة 2: تشغيل Script

```bash
# SSH إلى VPS
ssh root@72.61.94.71

# جعل Script قابل للتنفيذ
chmod +x deploy-vps.sh

# تشغيل Script
./deploy-vps.sh
```

---

## 🛠️ الطريقة 2: الإعداد اليدوي (خطوة بخطوة)

### الخطوة 1: الاتصال بـ VPS

```bash
ssh root@72.61.94.71
```

### الخطوة 2: تثبيت المتطلبات

```bash
# تحديث النظام
apt-get update && apt-get upgrade -y

# تثبيت Git
apt-get install -y git

# تثبيت Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# تثبيت PM2
npm install -g pm2

# تثبيت Nginx
apt-get install -y nginx
```

### الخطوة 3: استنساخ المشروع

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/Arwamohamedsalah/cleaning-website.git cleaning
cd cleaning
```

### الخطوة 4: إعداد Backend

```bash
# تثبيت Dependencies
cd backend
npm install --production

# إنشاء ملف .env
cp HOSTINGER_ENV.txt .env
nano .env  # عدّل القيم المطلوبة
```

**ملف .env يجب أن يحتوي على:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://ardbk.com
JWT_SECRET=your_strong_secret_key
```

### الخطوة 5: بناء Frontend

```bash
cd /var/www/cleaning
npm install --production
npm run build
```

### الخطوة 6: نقل Frontend Build

```bash
mkdir -p /var/www/client
rm -rf /var/www/client/*
cp -r /var/www/cleaning/dist/* /var/www/client/
```

### الخطوة 7: إعداد Nginx

```bash
# نسخ ملف التكوين
cp nginx-config.conf /etc/nginx/sites-available/ardbk.com

# تفعيل الموقع
ln -s /etc/nginx/sites-available/ardbk.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# اختبار التكوين
nginx -t

# إعادة تشغيل Nginx
systemctl restart nginx
```

### الخطوة 8: تشغيل Backend مع PM2

```bash
cd /var/www/cleaning/backend
pm2 start server.js --name cleaning-backend --env production
pm2 save
pm2 startup systemd -u root --hp /root
```

### الخطوة 9: تفعيل HTTPS

```bash
# تثبيت Certbot
apt-get install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
certbot --nginx -d ardbk.com -d www.ardbk.com --non-interactive --agree-tos --email admin@ardbk.com --redirect
```

---

## ✅ التحقق من الإعداد

### 1. التحقق من Backend

```bash
curl http://localhost:3000/api/health
```

يجب أن ترى:
```json
{"success":true,"message":"Server is running"}
```

### 2. التحقق من PM2

```bash
pm2 status
pm2 logs cleaning-backend
```

### 3. التحقق من Nginx

```bash
systemctl status nginx
nginx -t
```

### 4. التحقق من الموقع

افتح المتصفح واذهب إلى:
- `https://ardbk.com` - يجب أن يفتح الموقع
- `https://ardbk.com/api/health` - يجب أن يرجع JSON

---

## 🔄 تحديث المشروع

عند تحديث الكود:

```bash
# SSH إلى VPS
ssh root@72.61.94.71

# تحديث الكود
cd /var/www/cleaning
git pull origin main

# إعادة بناء Frontend
npm run build

# نقل Build الجديد
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/

# إعادة تشغيل Backend
cd backend
pm2 restart cleaning-backend
```

---

## 🛠️ أوامر مفيدة

### PM2 Commands

```bash
pm2 status                    # حالة التطبيقات
pm2 logs cleaning-backend     # عرض Logs
pm2 restart cleaning-backend   # إعادة تشغيل
pm2 stop cleaning-backend     # إيقاف
pm2 delete cleaning-backend   # حذف
```

### Nginx Commands

```bash
nginx -t                      # اختبار التكوين
systemctl restart nginx       # إعادة تشغيل
systemctl reload nginx        # إعادة تحميل
systemctl status nginx        # حالة الخدمة
```

### Logs

```bash
# PM2 Logs
pm2 logs cleaning-backend

# Nginx Logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System Logs
journalctl -u nginx -f
```

---

## 🔐 الأمان

### 1. Firewall (UFW)

```bash
# تثبيت UFW
apt-get install -y ufw

# السماح بالمنافذ المطلوبة
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# تفعيل Firewall
ufw enable
```

### 2. تحديث النظام

```bash
apt-get update && apt-get upgrade -y
```

### 3. MongoDB Security

- تأكد من إضافة IP الخاص بـ VPS إلى MongoDB Atlas Whitelist
- استخدم كلمات مرور قوية
- لا ترفع ملف `.env` إلى GitHub

---

## 🐛 حل المشاكل

### المشكلة 1: Backend لا يعمل

```bash
# تحقق من Logs
pm2 logs cleaning-backend

# تحقق من .env
cat /var/www/cleaning/backend/.env

# تحقق من MongoDB Connection
cd /var/www/cleaning/backend
node test-connection.js
```

### المشكلة 2: Nginx Error

```bash
# اختبار التكوين
nginx -t

# عرض Logs
tail -f /var/log/nginx/error.log
```

### المشكلة 3: Frontend لا يظهر

```bash
# تحقق من الملفات
ls -la /var/www/client/

# تحقق من الصلاحيات
chown -R www-data:www-data /var/www/client
chmod -R 755 /var/www/client
```

### المشكلة 4: SSL Certificate Issues

```bash
# إعادة الحصول على الشهادة
certbot renew --dry-run

# تحديث الشهادة
certbot renew
```

---

## 📝 Checklist قبل الرفع

- [ ] MongoDB URI صحيح و IP مضاف إلى Whitelist
- [ ] ملف `.env` معدّ بالقيم الصحيحة
- [ ] JWT_SECRET قوي وآمن
- [ ] PORT = 3000 في `.env`
- [ ] FRONTEND_URL = https://ardbk.com
- [ ] NODE_ENV = production
- [ ] Firewall معدّ بشكل صحيح
- [ ] SSL Certificate مفعّل

---

## 🎉 بعد الرفع

المشروع سيعمل على:
- **Frontend**: `https://ardbk.com`
- **Backend API**: `https://ardbk.com/api`
- **Health Check**: `https://ardbk.com/api/health`

---

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من Logs (PM2 و Nginx)
2. تحقق من ملف `.env`
3. تحقق من MongoDB Connection
4. تحقق من Firewall Rules

---

**ملاحظة**: تأكد من تعديل ملف `.env` بالقيم الصحيحة قبل تشغيل Backend!

