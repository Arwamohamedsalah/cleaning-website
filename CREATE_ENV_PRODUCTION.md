# 📝 إنشاء ملف .env للإنتاج - https://ardbk.com

## ⚡ الطريقة السريعة

### على VPS أو Hostinger:

```bash
cd /var/www/cleaning/backend
# أو
cd backend

# انسخ الملف
cp HOSTINGER_ENV.txt .env

# عدّل الملف
nano .env
```

---

## 📋 محتوى ملف .env المطلوب

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleaning-service?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=production

# Frontend URL (Production Domain)
FRONTEND_URL=https://ardbk.com

# JWT Secret
JWT_SECRET=your_very_strong_secret_key_here

# Admin User Credentials
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@ardbk.com
ADMIN_PASSWORD=your_strong_password_here
ADMIN_PHONE=0500000000

# WhatsApp API Configuration (اختياري)
WHATSAPP_API_URL=https://api.whatsapp.com/v1
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_PHONE_NUMBER=your_whatsapp_phone_number
```

---

## ✅ Checklist

- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL=https://ardbk.com`
- [ ] `PORT=3000`
- [ ] `MONGODB_URI` صحيح
- [ ] `JWT_SECRET` قوي وآمن
- [ ] `ADMIN_PASSWORD` قوي

---

## 🔐 توليد JWT_SECRET قوي

```bash
# على Linux/Mac
openssl rand -base64 64

# على Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

**بعد التعديل، أعد تشغيل Backend:**
```bash
pm2 restart cleaning-backend
```

