# 📁 هيكل المشروع - Cleaning Service Website

## 🎯 البنية الأساسية

```
cleaning/
│
├── 📱 FRONTEND (React + Vite)
│   ├── src/
│   │   ├── components/          # مكونات React
│   │   ├── pages/               # صفحات الموقع
│   │   ├── store/               # Redux Store
│   │   ├── services/             # API Services
│   │   ├── styles/              # ملفات CSS
│   │   └── schemas/             # Validation
│   ├── public/                  # ملفات عامة
│   ├── package.json
│   └── vite.config.js
│
├── 🔧 BACKEND (Node.js + Express)
│   ├── backend/
│   │   ├── controllers/         # منطق الأعمال
│   │   ├── models/              # نماذج MongoDB
│   │   ├── routes/              # مسارات API
│   │   ├── middleware/          # Middleware
│   │   ├── services/            # خدمات خارجية
│   │   ├── utils/               # أدوات مساعدة
│   │   ├── scripts/             # سكريبتات مساعدة
│   │   ├── config/              # إعدادات
│   │   └── server.js            # ملف السيرفر الرئيسي
│   └── package.json
│
├── 🚀 DEPLOYMENT
│   ├── deploy-vps.sh
│   ├── EXECUTE_ON_VPS.sh
│   ├── nginx-config.conf
│   ├── pm2-ecosystem.config.js
│   └── .github/workflows/
│
└── 📚 DOCUMENTATION
    ├── VPS_DEPLOYMENT_GUIDE.md
    ├── HOSTINGER_DEPLOYMENT.md
    └── [ملفات توثيق أخرى...]
```

---

## 📂 التفاصيل

### Frontend Structure

```
src/
├── components/              (15 ملف)
│   ├── Dashboard/          → Sidebar, TopBar, Layout
│   ├── Chart.jsx           → الرسوم البيانية
│   ├── Map.jsx             → الخرائط
│   ├── Modal.jsx           → النوافذ المنبثقة
│   └── [مكونات أخرى...]
│
├── pages/                  (21 صفحة)
│   ├── Home.jsx            → الصفحة الرئيسية
│   ├── Workers.jsx         → صفحة العاملات (مع سلايدر)
│   ├── Assistants.jsx      → صفحة المساعدات (مع سلايدر)
│   ├── Services.jsx         → صفحة الخدمات
│   ├── Login.jsx           → تسجيل الدخول
│   └── Dashboard/          → صفحات لوحة التحكم (12 صفحة)
│
├── store/                  (Redux)
│   ├── slices/             → 8 slices
│   └── store.js            → إعداد Redux
│
├── services/
│   └── api.js              → API Client (Base URL: /api في production)
│
└── styles/
    ├── globals.css
    ├── glassmorphism.css
    └── dashboard.css       → (يتضمن Swiper styles)
```

### Backend Structure

```
backend/
├── server.js               → نقطة البداية
│
├── controllers/            (12 controller)
│   ├── authController.js
│   ├── orderController.js
│   ├── customerController.js
│   ├── workerController.js
│   └── [controllers أخرى...]
│
├── models/                 (11 model)
│   ├── User.js
│   ├── Order.js
│   ├── Worker.js
│   └── [models أخرى...]
│
├── routes/                 (12 route)
│   ├── authRoutes.js       → /api/auth
│   ├── orderRoutes.js      → /api/orders
│   └── [routes أخرى...]
│
├── middleware/
│   ├── auth.js             → Authentication
│   └── errorHandler.js     → Error Handling
│
├── services/
│   ├── whatsappClient.js   → WhatsApp Setup
│   └── whatsappService.js  → WhatsApp Logic
│
├── utils/
│   ├── generateToken.js    → JWT Tokens
│   └── imageCompression.js → ضغط الصور
│
└── scripts/                (25+ script)
    ├── createAdmin.js
    ├── seed-all-data.js
    └── [scripts أخرى...]
```

---

## 🔗 API Endpoints

```
/api/auth          → Authentication
/api/orders        → Orders Management
/api/customers     → Customers Management
/api/workers       → Workers Management
/api/housemaids    → Assistants Management
/api/applications  → Applications Management
/api/messages      → Messages Management
/api/overview      → Dashboard Overview
/api/permissions   → Permissions Management
/api/reports       → Reports
/api/settings      → Settings
/api/discounts     → Discounts
```

---

## 🎨 المميزات الرئيسية

### Frontend:
- ✅ React 18 + Vite
- ✅ Redux Toolkit للـ State Management
- ✅ React Router للتنقل
- ✅ Swiper للصور (Carousel)
- ✅ Leaflet للخرائط
- ✅ Recharts للرسوم البيانية
- ✅ Glassmorphism Design

### Backend:
- ✅ Express.js
- ✅ MongoDB (Mongoose)
- ✅ JWT Authentication
- ✅ WhatsApp Integration
- ✅ Image Compression
- ✅ Error Handling
- ✅ CORS Configuration

---

## 📦 Build Output

```
dist/                    (يتم إنشاؤه بعد npm run build)
├── assets/
│   ├── index-*.js
│   └── index-*.css
├── img/
│   └── logo.jpg
└── index.html
```

---

## 🔐 ملفات غير موجودة في Git

- `backend/.env` - Environment Variables
- `backend/whatsapp-session/` - WhatsApp Session
- `node_modules/` - Dependencies
- `dist/` - Build Output
- `deploy.config.json` - Deployment Config

---

## 📊 الإحصائيات

- **Frontend Components**: 15
- **Pages**: 21
- **Backend Controllers**: 12
- **Backend Models**: 11
- **API Routes**: 12
- **Utility Scripts**: 25+
- **Documentation Files**: 20+

---

**للمزيد من التفاصيل**: راجع `PROJECT_STRUCTURE.md`

