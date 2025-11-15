# 🔧 دليل إعداد Nginx لمشروع Ard El Baraka

## 📋 المتطلبات

- Ubuntu/Debian Server
- Nginx مثبت
- Node.js Backend يعمل على port 3000
- React Frontend مبني في مجلد `dist/`

---

## 🚀 خطوات الإعداد السريع

### 1. نسخ ملف Nginx

```bash
# نسخ الملف إلى sites-available
sudo cp nginx-ardbk.conf /etc/nginx/sites-available/ardbk.com

# أو استخدام النسخة البسيطة
sudo cp nginx-simple.conf /etc/nginx/sites-available/ardbk.com
```

### 2. تفعيل الموقع

```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/ardbk.com /etc/nginx/sites-enabled/

# حذف الموقع الافتراضي (اختياري)
sudo rm /etc/nginx/sites-enabled/default
```

### 3. تحديث المسارات

افتح الملف وتأكد من المسارات:

```bash
sudo nano /etc/nginx/sites-available/ardbk.com
```

**تأكد من:**
- `root /var/www/client;` - مسار مجلد Frontend
- `proxy_pass http://localhost:3000;` - Backend port

### 4. اختبار الإعدادات

```bash
# اختبار صحة الإعدادات
sudo nginx -t

# إذا كانت النتيجة "syntax is ok" و "test is successful"
# قم بإعادة تحميل Nginx
sudo systemctl reload nginx
```

### 5. تثبيت SSL (HTTPS)

```bash
# تثبيت Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# الحصول على شهادة SSL
sudo certbot --nginx -d ardbk.com -d www.ardbk.com

# Certbot سيقوم تلقائياً بتحديث ملف Nginx
```

### 6. التحقق من الحالة

```bash
# التحقق من حالة Nginx
sudo systemctl status nginx

# التحقق من حالة Backend
pm2 status

# اختبار الموقع
curl http://localhost
curl http://localhost/api/health
```

---

## 📁 هيكل المجلدات المطلوب

```
/var/www/
└── client/              # React Frontend Build
    ├── index.html
    ├── assets/
    └── ...
```

**لنسخ Frontend Build:**

```bash
# من مجلد المشروع
npm run build

# نسخ إلى /var/www/client
sudo cp -r dist/* /var/www/client/
sudo chown -R www-data:www-data /var/www/client
```

---

## 🔍 التحقق من الإعدادات

### 1. التحقق من Backend

```bash
# تأكد أن Backend يعمل على port 3000
curl http://localhost:3000/api/health

# يجب أن ترى:
# {"success":true,"message":"Server is running"}
```

### 2. التحقق من Frontend

```bash
# تأكد من وجود index.html
ls -la /var/www/client/index.html

# يجب أن ترى الملف موجود
```

### 3. التحقق من Nginx

```bash
# اختبار الإعدادات
sudo nginx -t

# عرض الإعدادات النشطة
sudo nginx -T | grep -A 20 "server_name ardbk.com"
```

---

## 🛠️ استكشاف الأخطاء

### المشكلة: 502 Bad Gateway

**السبب:** Backend غير شغال أو على port خاطئ

**الحل:**
```bash
# تحقق من Backend
pm2 status
pm2 logs

# تأكد من PORT في .env
cd /var/www/backend
cat .env | grep PORT
```

### المشكلة: 404 Not Found

**السبب:** Frontend build غير موجود أو في مسار خاطئ

**الحل:**
```bash
# تحقق من المسار
ls -la /var/www/client/

# إذا كان فارغاً، انسخ Build
cd /path/to/project
npm run build
sudo cp -r dist/* /var/www/client/
```

### المشكلة: API لا يعمل

**السبب:** Proxy configuration خاطئ

**الحل:**
```bash
# تحقق من location /api/ في nginx config
sudo nano /etc/nginx/sites-available/ardbk.com

# تأكد من:
# proxy_pass http://localhost:3000;
# (بدون /api/ في النهاية)

# أعد تحميل Nginx
sudo systemctl reload nginx
```

### المشكلة: React Router لا يعمل

**السبب:** try_files غير موجود

**الحل:**
```bash
# تأكد من وجود في location /:
# try_files $uri $uri/ /index.html;

sudo nano /etc/nginx/sites-available/ardbk.com
sudo systemctl reload nginx
```

---

## 🔐 إعدادات الأمان

### 1. تحديث SSL

```bash
# تحديث شهادة SSL تلقائياً
sudo certbot renew --dry-run

# إضافة cron job للتحديث التلقائي
sudo crontab -e
# أضف:
# 0 0 * * * certbot renew --quiet
```

### 2. Firewall

```bash
# فتح البورتات المطلوبة
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 3. تحديث Nginx

```bash
# تحديث Nginx
sudo apt update
sudo apt upgrade nginx
```

---

## 📝 ملفات Nginx المتوفرة

1. **nginx-ardbk.conf** - إعدادات كاملة مع SSL و Security Headers
2. **nginx-simple.conf** - إعدادات بسيطة للبدء السريع

---

## ✅ قائمة التحقق النهائية

- [ ] Nginx مثبت ويعمل
- [ ] ملف الإعدادات في `/etc/nginx/sites-available/ardbk.com`
- [ ] رابط رمزي في `/etc/nginx/sites-enabled/`
- [ ] Frontend Build في `/var/www/client/`
- [ ] Backend يعمل على port 3000
- [ ] SSL مثبت (HTTPS)
- [ ] الموقع يعمل على `https://ardbk.com`
- [ ] API يعمل على `https://ardbk.com/api/health`
- [ ] React Router يعمل (جميع الصفحات)

---

## 🆘 الدعم

إذا واجهت مشاكل:

1. تحقق من logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

2. تحقق من Backend logs:
   ```bash
   pm2 logs
   ```

3. اختبار الإعدادات:
   ```bash
   sudo nginx -t
   ```

---

## 📚 مراجع إضافية

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Certbot Documentation](https://certbot.eff.org/)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview)

---

**تم إنشاء هذا الملف بواسطة:** AI Assistant  
**التاريخ:** 2024  
**المشروع:** Ard El Baraka Cleaning Service

