# 🔌 دليل الاتصال بـ MongoDB Compass - خطوة بخطوة

## 📝 Connection String:

```
mongodb+srv://ardalbaraka2_db_user:hN0l4mg1AL8DYg3J@cluster0.rb2r5bk.mongodb.net/cleaning?retryWrites=true&w=majority
```

## 🎯 خطوات الاتصال:

### الخطوة 1: افتح MongoDB Compass
- إذا لم يكن مثبتاً، حمّله من: https://www.mongodb.com/try/download/compass

### الخطوة 2: إنشاء Connection جديد
1. في MongoDB Compass، اضغط على "New Connection"
2. أو اضغط `Ctrl + N`

### الخطوة 3: الصق Connection String
1. انسخ Connection String أعلاه بالكامل
2. الصقه في الحقل "Connection String"
3. **تأكد من عدم وجود مسافات إضافية**

### الخطوة 4: الاتصال
1. اضغط "Connect"
2. انتظر حتى يتم الاتصال

## ⚠️ إذا ظهر خطأ:

### خطأ 1: "Authentication failed"
**الحل:**
- تأكد من أن Connection String صحيح
- تأكد من أن Username و Password صحيحين

### خطأ 2: "Server selection timed out" أو "ENOTFOUND"
**الحل:**
1. اذهب إلى MongoDB Atlas: https://cloud.mongodb.com
2. سجّل دخول
3. اختر Cluster الخاص بك
4. اضغط "Network Access" من القائمة الجانبية
5. اضغط "Add IP Address"
6. اضغط "Add Current IP Address" (أو "Allow Access from Anywhere" للاختبار)
7. انتظر دقيقة ثم حاول الاتصال مرة أخرى

### خطأ 3: "Connection string is invalid"
**الحل:**
- تأكد من نسخ Connection String بالكامل
- تأكد من عدم وجود مسافات في البداية أو النهاية
- تأكد من أن Connection String يبدأ بـ `mongodb+srv://`

## 🔍 طريقة بديلة - الاتصال بدون Connection String:

### الطريقة 1: استخدام Hostname و Port
1. في MongoDB Compass، اختر "Fill in connection fields individually"
2. Hostname: `cluster0.rb2r5bk.mongodb.net`
3. Port: اتركه فارغاً (أو 27017)
4. Authentication: Username / Password
   - Username: `ardalbaraka2_db_user`
   - Password: `hN0l4mg1AL8DYg3J`
5. Authentication Database: `admin`
6. اضغط "Connect"

### الطريقة 2: من MongoDB Atlas
1. اذهب إلى MongoDB Atlas: https://cloud.mongodb.com
2. اضغط "Connect" بجانب Cluster
3. اختر "Connect with MongoDB Compass"
4. انسخ Connection String الذي يظهر
5. الصقه في MongoDB Compass

## ✅ بعد الاتصال بنجاح:

ستجد:
- **Database:** `cleaning`
- **Collection:** `housemaids` (6 documents)
- **Collection:** `workers`
- **Collection:** `users`
- وغيرها...

## 📞 إذا استمرت المشكلة:

1. تأكد من أن الإنترنت يعمل
2. تأكد من أن MongoDB Atlas Cluster يعمل (Status: Running)
3. جرب الاتصال من MongoDB Atlas Dashboard مباشرة
4. تحقق من أن Firewall لا يمنع الاتصال

