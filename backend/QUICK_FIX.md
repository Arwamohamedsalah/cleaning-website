# 🔧 إصلاح سريع لمشكلة MongoDB

## ❌ الخطأ الحالي

```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

## ✅ الحل السريع

### 1. افتح ملف `backend/.env`

### 2. تأكد من أن `MONGODB_URI` يحتوي على رابط صحيح من MongoDB Atlas

**❌ رابط خاطئ (مثال):**
```
MONGODB_URI=mongodb+srv://cluster.mongodb.net/cleaning-service
```

**✅ رابط صحيح (مثال):**
```
MONGODB_URI=mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/cleaning-service?retryWrites=true&w=majority
```

### 3. كيف تحصل على رابط صحيح؟

1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. سجّل دخول
3. اضغط **"Connect"** بجانب Cluster
4. اختر **"Connect your application"**
5. انسخ الرابط واستبدل `<username>` و `<password>`

### 4. بعد التحديث، شغّل مرة أخرى:

```bash
cd backend
node server.js
```

**يجب أن ترى:**
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Server running in development mode on port 5000
```

---

## 📝 ملاحظات

- ✅ تم إصلاح التحذيرات في `database.js` (useNewUrlParser, useUnifiedTopology)
- ✅ الآن الكود يعطي رسائل خطأ أوضح
- ✅ راجع `FIX_CONNECTION.md` للتفاصيل الكاملة

