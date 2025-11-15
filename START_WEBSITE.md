# 🚀 كيفية تشغيل الموقع

## ⚡ الطريقة السريعة

### 1. تشغيل Backend

```bash
cd backend
npm install
npm run dev
```

**Backend سيعمل على:** `http://localhost:3001`

---

### 2. تشغيل Frontend

```bash
# في terminal جديد
npm install
npm run dev
```

**Frontend سيعمل على:** `http://localhost:3000`

---

## 📝 البورتات

- **Frontend (Vite)**: `http://localhost:3000`
- **Backend (Express)**: `http://localhost:3001`
- **Backend API**: `http://localhost:3001/api`

---

## ✅ التحقق

1. افتح: `http://localhost:3000`
2. تحقق من API: `http://localhost:3001/api/health`

---

## 🐛 حل المشاكل

### الموقع لا يعمل

1. **تأكد من تشغيل Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **تأكد من تشغيل Frontend:**
   ```bash
   npm run dev
   ```

3. **تحقق من البورتات:**
   - Frontend: 3000
   - Backend: 3001

### خطأ في الاتصال

- تأكد من أن Backend يعمل على port 3001
- تأكد من أن Frontend يعمل على port 3000
- تحقق من ملف `.env` في `backend/`

---

**ملاحظة**: يجب تشغيل Backend و Frontend في terminal منفصل!

