# كيفية إنشاء ملف .env

## الطريقة 1: نسخ من القالب

```bash
cd backend
copy ENV_TEMPLATE.txt .env
```

أو على Linux/Mac:
```bash
cp ENV_TEMPLATE.txt .env
```

## الطريقة 2: إنشاء يدوياً

أنشئ ملف جديد باسم `.env` في مجلد `backend` وأضف المحتوى التالي:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Admin User Credentials
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@cleaning.com
ADMIN_PASSWORD=admin123
ADMIN_PHONE=0500000000

# WhatsApp API (اختياري)
WHATSAPP_API_URL=https://api.whatsapp.com/v1
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_PHONE_NUMBER=your_whatsapp_phone_number
```

## خطوات الإعداد:

1. **احصل على MongoDB URI:**
   - اذهب إلى MongoDB Atlas
   - اختر Cluster الخاص بك
   - اضغط Connect > Connect your application
   - انسخ Connection String
   - استبدل `<password>` بكلمة مرور Database User
   - استبدل `<dbname>` بـ `cleaning-service`

2. **حدّث JWT_SECRET:**
   - استخدم سلسلة عشوائية قوية
   - يمكنك استخدام: `openssl rand -base64 32`

3. **حدّث بيانات Admin:**
   - غيّر `ADMIN_EMAIL` و `ADMIN_PASSWORD` حسب رغبتك

4. **احفظ الملف** كـ `.env` (بدون أي امتداد آخر)

