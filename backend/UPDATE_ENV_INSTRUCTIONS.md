# 🔧 تحديث ملف .env

## ⚠️ مهم جداً

يجب تحديث `MONGODB_URI` في ملف `backend/.env` ليشمل `/cleaning` في النهاية.

## 📝 الخطوات:

1. افتح ملف `backend/.env`

2. ابحث عن السطر:
   ```
   MONGODB_URI=mongodb+srv://ardalbaraka2_db_user:hN0l4mg1AL8DYg3J@cluster0.rb2r5bk.mongodb.net/
   ```

3. غيّره إلى:
   ```
   MONGODB_URI=mongodb+srv://ardalbaraka2_db_user:hN0l4mg1AL8DYg3J@cluster0.rb2r5bk.mongodb.net/cleaning
   ```

   **ملاحظة:** أضف `/cleaning` قبل أي `?` إذا كان موجوداً

4. احفظ الملف

5. أعد تشغيل Backend Server

## ✅ التحقق:

بعد التحديث، يجب أن ترى في Backend logs:
```
✅ MongoDB Connected: cluster0.rb2r5bk.mongodb.net
📊 Database: cleaning
```

## 📊 البيانات:

البيانات موجودة الآن في:
- **Database:** `cleaning`
- **Collection:** `housemaids`
- **Count:** 6 housemaids

