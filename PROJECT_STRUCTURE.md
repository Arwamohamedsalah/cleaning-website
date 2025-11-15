# 📁 هيكل المشروع الكامل - Cleaning Service Website

## 🎯 نظرة عامة

```
cleaning/
├── 📱 Frontend (React + Vite)
├── 🔧 Backend (Node.js + Express)
├── 📚 Documentation
├── 🚀 Deployment Scripts
└── ⚙️ Configuration Files
```

---

## 📂 الهيكل التفصيلي

### 🎨 Frontend (React + Vite)

```
src/
├── App.jsx                          # Main App Component
├── App.test.jsx                     # App Tests
├── index.jsx                        # Entry Point
│
├── components/                       # React Components
│   ├── Chart.jsx                    # Charts Component
│   ├── CounterAnimation.jsx         # Animated Counter
│   ├── ErrorBoundary.jsx            # Error Handler
│   ├── FloatingShapes.jsx           # Background Shapes
│   ├── Footer.jsx                   # Footer Component
│   ├── GlassButton.jsx              # Glassmorphism Button
│   ├── GlassCard.jsx                # Glassmorphism Card
│   ├── Loader.jsx                    # Loading Spinner
│   ├── Map.jsx                      # Map Component (Leaflet)
│   ├── Modal.jsx                     # Modal Dialog
│   ├── Navbar.jsx                   # Navigation Bar
│   ├── PieChart.jsx                 # Pie Chart Component
│   │
│   └── Dashboard/                   # Dashboard Components
│       ├── DashboardLayout.jsx      # Main Layout
│       ├── Sidebar.jsx               # Sidebar Navigation
│       └── TopBar.jsx                # Top Bar
│
├── pages/                           # Page Components
│   ├── Home.jsx                     # Home Page
│   ├── Login.jsx                    # Login Page
│   ├── Contact.jsx                   # Contact Page
│   ├── Services.jsx                 # Services Page
│   ├── Workers.jsx                   # Workers Page (with carousel)
│   ├── Assistants.jsx               # Assistants Page (with carousel)
│   ├── Recruitment.jsx              # Recruitment Page
│   ├── ServiceRequest.jsx           # Service Request Page
│   ├── WorkerDetails.jsx            # Worker Details Page
│   │
│   └── Dashboard/                   # Dashboard Pages
│       ├── Overview.jsx             # Dashboard Overview
│       ├── Orders.jsx               # Orders Management
│       ├── Customers.jsx            # Customers Management
│       ├── Workers.jsx              # Workers Management
│       ├── Assistants.jsx           # Assistants Management
│       ├── Applications.jsx         # Applications Management
│       ├── Messages.jsx             # Messages Management
│       ├── Discounts.jsx            # Discounts Management
│       ├── Reports.jsx              # Reports Page
│       ├── Settings.jsx             # Settings Page
│       ├── Profile.jsx              # User Profile
│       └── Notifications.jsx       # Notifications
│
├── store/                           # Redux Store
│   ├── store.js                     # Redux Store Configuration
│   ├── hooks.js                     # Redux Hooks
│   │
│   └── slices/                      # Redux Slices
│       ├── authSlice.js             # Authentication State
│       ├── ordersSlice.js           # Orders State
│       ├── customersSlice.js        # Customers State
│       ├── workersSlice.js          # Workers State
│       ├── housemaidsSlice.js       # Housemaids/Assistants State
│       ├── applicationsSlice.js     # Applications State
│       ├── messagesSlice.js         # Messages State
│       └── themeSlice.js            # Theme Settings
│
├── services/                        # API Services
│   └── api.js                       # API Client (Base URL Configuration)
│
├── schemas/                         # Validation Schemas
│   └── validationSchemas.js        # Zod Validation Schemas
│
└── styles/                          # CSS Styles
    ├── globals.css                  # Global Styles
    ├── glassmorphism.css            # Glassmorphism Effects
    └── dashboard.css                # Dashboard Styles (includes Swiper styles)
```

---

### 🔧 Backend (Node.js + Express)

```
backend/
├── server.js                        # Main Server File
├── package.json                     # Backend Dependencies
│
├── config/                          # Configuration
│   └── database.js                  # MongoDB Connection
│
├── controllers/                     # Route Controllers
│   ├── authController.js           # Authentication Logic
│   ├── orderController.js           # Orders Logic
│   ├── customerController.js        # Customers Logic
│   ├── workerController.js          # Workers Logic
│   ├── housemaidController.js       # Housemaids/Assistants Logic
│   ├── applicationController.js     # Applications Logic
│   ├── messageController.js         # Messages Logic
│   ├── overviewController.js        # Overview/Dashboard Logic
│   ├── permissionController.js      # Permissions Logic
│   ├── reportController.js          # Reports Logic
│   ├── settingsController.js        # Settings Logic
│   └── discountController.js       # Discounts Logic
│
├── models/                          # MongoDB Models
│   ├── User.js                      # User Model
│   ├── Order.js                     # Order Model
│   ├── Customer.js                  # Customer Model
│   ├── Worker.js                    # Worker Model
│   ├── Housemaid.js                 # Housemaid/Assistant Model
│   ├── Application.js                # Application Model
│   ├── Message.js                    # Message Model
│   ├── Notification.js               # Notification Model
│   ├── Permission.js                 # Permission Model
│   ├── Settings.js                   # Settings Model
│   └── Discount.js                   # Discount Model
│
├── routes/                          # API Routes
│   ├── authRoutes.js                # /api/auth
│   ├── orderRoutes.js                # /api/orders
│   ├── customerRoutes.js             # /api/customers
│   ├── workerRoutes.js               # /api/workers
│   ├── housemaidRoutes.js            # /api/housemaids
│   ├── applicationRoutes.js          # /api/applications
│   ├── messageRoutes.js              # /api/messages
│   ├── overviewRoutes.js             # /api/overview
│   ├── permissionRoutes.js           # /api/permissions
│   ├── reportRoutes.js               # /api/reports
│   ├── settingsRoutes.js             # /api/settings
│   └── discountRoutes.js             # /api/discounts
│
├── middleware/                      # Express Middleware
│   ├── auth.js                      # Authentication Middleware
│   └── errorHandler.js              # Error Handling Middleware
│
├── services/                          # External Services
│   ├── whatsappClient.js            # WhatsApp Client Setup
│   └── whatsappService.js           # WhatsApp Service Logic
│
├── utils/                           # Utility Functions
│   ├── generateToken.js             # JWT Token Generation
│   └── imageCompression.js          # Image Compression
│
├── scripts/                         # Utility Scripts
│   ├── createAdmin.js               # Create Admin User
│   ├── view-admin.js                # View Admin Users
│   ├── view-supervisors.js          # View Supervisors
│   ├── reset-admin-password.js      # Reset Admin Password
│   ├── reset-supervisor-password.js # Reset Supervisor Password
│   ├── seed-all-data.js             # Seed All Data
│   ├── seed-workers.js              # Seed Workers
│   ├── seed-housemaids.js           # Seed Housemaids
│   ├── add-more-customers.js        # Add Customers
│   ├── check-all-data.js            # Check All Data
│   ├── check-workers-data.js        # Check Workers Data
│   ├── check-housemaids-data.js     # Check Housemaids Data
│   ├── verify-mongodb.js            # Verify MongoDB Connection
│   ├── verify-cleaning-db.js        # Verify Database
│   ├── verify-frontend-backend-connection.js # Verify Connection
│   └── [other utility scripts...]
│
├── .env                             # Environment Variables (not in git)
├── HOSTINGER_ENV.txt                # Production Env Template
├── ENV_TEMPLATE.txt                 # Development Env Template
│
└── whatsapp-session/                # WhatsApp Session (not in git)
    └── session/                      # WhatsApp Session Files
```

---

### 📚 Documentation Files

```
Root Directory/
├── README.md                        # Main README (removed)
├── BACKEND_SETUP.md                 # Backend Setup Guide
├── INTEGRATION_GUIDE.md             # Integration Guide
├── MONGODB_SETUP.md                 # MongoDB Setup
├── QUICK_START.md                   # Quick Start Guide
├── SITE_URLS.md                     # Site URLs Reference
├── START_BACKEND.md                 # Start Backend Guide
├── SYSTEM_STATUS.md                   # System Status
├── TEST_CONNECTION.md               # Test Connection Guide
├── TROUBLESHOOTING.md               # Troubleshooting Guide
│
├── HOSTINGER_DEPLOYMENT.md          # Hostinger Deployment Guide
├── HOSTINGER_SETUP_COMPLETE.md      # Hostinger Setup Summary
├── QUICK_DEPLOY_HOSTINGER.md        # Quick Hostinger Deploy
├── README_HOSTINGER.md              # Hostinger README
│
├── VPS_DEPLOYMENT_GUIDE.md          # VPS Deployment Guide
├── VPS_DEPLOYMENT_SUMMARY.md        # VPS Deployment Summary
├── START_HERE_VPS.md                # VPS Quick Start
├── STEP_BY_STEP_VPS.md              # VPS Step by Step
├── README_VPS_DEPLOYMENT.md         # VPS README
│
├── GITHUB_DEPLOYMENT.md             # GitHub Deployment Guide
├── QUICK_GITHUB_DEPLOY.md           # Quick GitHub Deploy
├── README_DEPLOYMENT.md             # Deployment README
│
├── PRODUCTION_DEPLOYMENT.md         # Production Deployment
├── PRODUCTION_SETUP_SUMMARY.md      # Production Setup Summary
├── DEPLOY.md                        # Deploy Guide
└── DEPLOYMENT_REPORT_TEMPLATE.md    # Deployment Report Template
```

---

### 🚀 Deployment Scripts

```
Root Directory/
├── deploy-vps.sh                    # Full VPS Deployment Script
├── quick-deploy-vps.sh              # Quick VPS Deployment
├── EXECUTE_ON_VPS.sh                # Execute on VPS Script
├── deploy.js                        # Node.js Deployment Script
├── deploy.config.json.example       # Deployment Config Template
│
├── nginx-config.conf                # Nginx Configuration
├── pm2-ecosystem.config.js          # PM2 Configuration
│
└── .github/
    └── workflows/
        └── deploy-hostinger.yml     # GitHub Actions Workflow
```

---

### ⚙️ Configuration Files

```
Root Directory/
├── package.json                     # Frontend Dependencies & Scripts
├── vite.config.js                   # Vite Configuration
├── index.html                       # HTML Entry Point
├── .gitignore                       # Git Ignore Rules
├── .htaccess                        # Apache Configuration (for Hostinger)
│
├── public/                          # Public Assets
│   └── img/
│       └── logo.jpg                 # Logo Image
│
└── dist/                            # Build Output (not in git)
    ├── assets/                      # Compiled Assets
    ├── img/                         # Images
    └── index.html                   # Built HTML
```

---

## 📊 إحصائيات المشروع

### Frontend
- **Components**: 15 component
- **Pages**: 21 page
- **Redux Slices**: 8 slices
- **Styles**: 3 CSS files

### Backend
- **Controllers**: 12 controller
- **Models**: 11 model
- **Routes**: 12 route
- **Scripts**: 25+ utility script

### Documentation
- **Deployment Guides**: 10+ guides
- **Setup Guides**: 5+ guides
- **Configuration Files**: 5+ configs

---

## 🔗 التدفق (Flow)

### Frontend → Backend
```
User Action (React)
    ↓
Redux Action
    ↓
API Call (api.js)
    ↓
Backend API (Express)
    ↓
Controller
    ↓
Model (MongoDB)
    ↓
Response
```

### Authentication Flow
```
Login Page
    ↓
authAPI.login()
    ↓
/api/auth/login
    ↓
authController.login()
    ↓
JWT Token
    ↓
Store in Redux + localStorage
```

### Image Carousel Flow
```
Workers/Assistants Page
    ↓
Swiper Component
    ↓
worker.photos[] array
    ↓
Multiple Images Display
    ↓
Auto-play + Navigation
```

---

## 🎯 الملفات المهمة

### للتطوير:
- `src/App.jsx` - Main App
- `src/services/api.js` - API Configuration
- `backend/server.js` - Backend Server
- `backend/config/database.js` - Database Config

### للإنتاج:
- `backend/.env` - Environment Variables
- `nginx-config.conf` - Nginx Config
- `pm2-ecosystem.config.js` - PM2 Config
- `EXECUTE_ON_VPS.sh` - Deployment Script

### للتوثيق:
- `VPS_DEPLOYMENT_GUIDE.md` - VPS Guide
- `HOSTINGER_DEPLOYMENT.md` - Hostinger Guide
- `GITHUB_DEPLOYMENT.md` - GitHub Deployment

---

## 📦 Dependencies الرئيسية

### Frontend:
- React 18
- React Router DOM
- Redux Toolkit
- Vite
- Swiper (للصور)
- Leaflet (للخرائط)
- Recharts (للرسوم البيانية)

### Backend:
- Express
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Bcrypt
- Multer (للصور)
- WhatsApp Web.js
- Sharp (ضغط الصور)

---

## 🔐 ملفات حساسة (غير موجودة في Git)

- `backend/.env` - Environment Variables
- `backend/whatsapp-session/` - WhatsApp Session
- `deploy.config.json` - Deployment Config
- `node_modules/` - Dependencies
- `dist/` - Build Output

---

## 📝 ملاحظات

1. **الصور**: تستخدم Swiper carousel في Workers و Assistants
2. **API**: Base URL تلقائي (`/api` في production)
3. **Deployment**: Scripts جاهزة للـ VPS و Hostinger
4. **Database**: MongoDB Atlas
5. **Authentication**: JWT Tokens

---

**آخر تحديث**: [التاريخ الحالي]

