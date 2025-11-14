# 🔌 الاتصال بـ MongoDB Compass

## 📝 Connection String للاتصال بـ MongoDB Compass:

```
mongodb+srv://ardalbaraka2_db_user:hN0l4mg1AL8DYg3J@cluster0.rb2r5bk.mongodb.net/cleaning?retryWrites=true&w=majority
```

## 📋 خطوات الاتصال:

1. **افتح MongoDB Compass**

2. **انسخ Connection String أعلاه**

3. **الصق في حقل "New Connection"**

4. **اضغط "Connect"**

5. **ستجد:**
   - Database: `cleaning`
   - Collection: `housemaids` (يحتوي على 6 مساعدات)
   - Collection: `workers` (للعاملات)
   - Collection: `users` (للمستخدمين)
   - Collection: `orders` (للطلبات)
   - Collection: `customers` (للعملاء)
   - Collection: `applications` (لطلبات التوظيف)
   - Collection: `messages` (للرسائل)
   - Collection: `notifications` (للإشعارات)

## 📊 البيانات المتوقعة:

### Collection: `housemaids`
- **Count:** 6 documents
- **Documents:**
  1. خديجة سالم - monthly
  2. نورا عبدالله - yearly
  3. ليلى أحمد - monthly
  4. زينب محمود - monthly
  5. فاطمة علي - yearly
  6. مريم حسن - monthly

## 🔍 للبحث عن البيانات:

1. اختر Database: `cleaning`
2. اختر Collection: `housemaids`
3. اضغط "Find" لرؤية جميع البيانات
4. يمكنك استخدام Filters للبحث

## ⚠️ ملاحظات:

- تأكد من أن IP Address الخاص بك مسموح في MongoDB Atlas
- إذا لم تستطع الاتصال، اذهب إلى MongoDB Atlas → Network Access → Add IP Address

