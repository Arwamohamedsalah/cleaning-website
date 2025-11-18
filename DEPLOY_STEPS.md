# خطوات رفع التحديثات على السيرفر

## 1. الاتصال بالسيرفر عبر SSH

```bash
ssh root@72.61.94.71
```

أو إذا كان لديك مستخدم آخر:
```bash
ssh username@72.61.94.71
```

## 2. الانتقال إلى مجلد المشروع

```bash
cd /var/www/cleaning-website
```

أو حسب مسار المشروع على السيرفر:
```bash
cd /var/www
```

## 3. جلب التحديثات من GitHub

### الطريقة الأولى: Pull من Branch الجديد
```bash
# جلب جميع branches
git fetch origin

# الانتقال إلى branch الجديد
git checkout reports-improvements

# أو إذا كنت على main وترغب في merge
git checkout main
git pull origin reports-improvements
```

### الطريقة الثانية: Pull من Main (بعد merge)
```bash
# إذا قمت ب merge الـ branch في GitHub
git checkout main
git pull origin main
```

## 4. تثبيت التحديثات (إذا لزم الأمر)

```bash
# في مجلد الباك اند
cd backend
npm install

# في مجلد الجذر (إذا كان هناك تحديثات في package.json)
cd /var/www/cleaning-website
npm install
```

## 5. بناء Frontend (إذا لزم الأمر)

```bash
# من مجلد الجذر
npm run build
```

## 6. إعادة تشغيل Backend مع PM2

```bash
# إعادة تشغيل جميع العمليات
pm2 restart all

# أو إعادة تشغيل backend فقط
pm2 restart backend

# التحقق من حالة العمليات
pm2 status

# عرض السجلات
pm2 logs backend
```

## 7. إعادة تحميل Nginx

```bash
# اختبار التكوين أولاً
sudo nginx -t

# إذا كان التكوين صحيحاً، أعد تحميل Nginx
sudo systemctl reload nginx

# أو
sudo service nginx reload
```

## 8. التحقق من أن كل شيء يعمل

```bash
# التحقق من حالة PM2
pm2 status

# التحقق من حالة Nginx
sudo systemctl status nginx

# التحقق من السجلات
pm2 logs backend --lines 50
```

## 9. اختبار الموقع

افتح المتصفح واذهب إلى:
- `https://ardbk.com/dashboard/reports`
- تحقق من أن التحديثات ظهرت بشكل صحيح

## ملاحظات مهمة

1. **احفظ نسخة احتياطية قبل التحديث:**
   ```bash
   # نسخ احتياطي من قاعدة البيانات (إذا لزم الأمر)
   mongodump --out /backup/$(date +%Y%m%d)
   
   # نسخ احتياطي من الملفات
   cp -r /var/www/cleaning-website /var/www/cleaning-website-backup-$(date +%Y%m%d)
   ```

2. **إذا واجهت مشاكل:**
   ```bash
   # الرجوع إلى النسخة السابقة
   git checkout main
   git reset --hard origin/main
   pm2 restart all
   ```

3. **التحقق من المتغيرات البيئية:**
   ```bash
   # تأكد من أن ملف .env موجود ومحدث
   cd /var/www/cleaning-website/backend
   cat .env
   ```

## روابط مفيدة

- **GitHub Repository:** https://github.com/Arwamohamedsalah/cleaning-website.git
- **Branch الجديد:** reports-improvements
- **الموقع:** https://ardbk.com

