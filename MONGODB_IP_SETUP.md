# 🔧 إضافة IP Address إلى MongoDB Atlas

## IP Address الخاص بالسيرفر:
```
72.61.94.71
```

## خطوات إضافة IP Address إلى MongoDB Atlas:

### 1. تسجيل الدخول إلى MongoDB Atlas
- اذهب إلى: https://cloud.mongodb.com
- سجل الدخول بحسابك

### 2. إضافة IP Address إلى Network Access

1. من القائمة الجانبية، اختر **"Network Access"**
2. اضغط على زر **"Add IP Address"**
3. اختر **"Add Current IP Address"** أو **"Add IP Address"**
4. أدخل IP Address: `72.61.94.71`
5. أو للسماح من أي مكان (للتطوير فقط): `0.0.0.0/0`
6. اضغط **"Confirm"**

### 3. التحقق من Connection String

1. اذهب إلى **"Database"** > **"Connect"**
2. اختر **"Connect your application"**
3. انسخ Connection String
4. استبدل:
   - `<password>` بكلمة مرور المستخدم
   - `<dbname>` بـ `cleaning-service`

### 4. مثال على Connection String:

```
mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

### 5. تحديث ملف .env على السيرفر:

```bash
# على السيرفر
cd /var/www/cleaning/backend
nano .env
```

**أضف/عدّل:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

### 6. اختبار الاتصال:

```bash
cd /var/www/cleaning/backend
npm run test:db
```

## ملاحظات مهمة:

1. **IP Address يجب أن يكون مضاف في Network Access**
2. **Database User يجب أن يكون موجود وله صلاحيات**
3. **Connection String يجب أن يكون صحيح**
4. **كلمة المرور في Connection String يجب أن تكون URL-encoded إذا كانت تحتوي على رموز خاصة**

## إذا كان IP Address يتغير:

إذا كان IP Address للسيرفر يتغير، يمكنك:
- إضافة `0.0.0.0/0` للسماح من أي مكان (غير آمن للإنتاج)
- أو استخدام MongoDB Atlas IP Access List API لتحديث IP تلقائياً

