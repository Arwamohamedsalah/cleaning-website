import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initializeWhatsApp } from './services/whatsappClient.js';

// Load env vars
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
connectDB();

// Initialize WhatsApp Client
initializeWhatsApp();

const app = express();

// CORS Configuration for Production
const allowedOrigins = [
  'http://ardbk.com',
  'https://ardbk.com',
  'http://www.ardbk.com',
  'https://www.ardbk.com',
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Routes
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import housemaidRoutes from './routes/housemaidRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import overviewRoutes from './routes/overviewRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import discountRoutes from './routes/discountRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/housemaids', housemaidRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/discounts', discountRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Test route for settings
app.get('/api/settings/test', (req, res) => {
  res.json({ success: true, message: 'Settings route is working' });
});

// Note: In VPS deployment, Nginx serves static files
// Only serve static files if NODE_ENV is production AND no reverse proxy is used
// For VPS with Nginx, this section is disabled
if (process.env.NODE_ENV === 'production' && process.env.SERVE_STATIC === 'true') {
  // Path to the frontend build directory
  const frontendPath = path.join(__dirname, '..', 'dist');
  
  // Serve static files
  app.use(express.static(frontendPath));
  
  // Handle React routing - return all requests to React app
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Error handler
app.use(errorHandler);

// Port configuration for Hostinger
// Hostinger typically uses port 3000 for Node.js apps
// Check your Hostinger Node.js app settings for the correct port
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3001);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend served from: ${path.join(__dirname, '..', 'dist')}`);
    console.log(`Site URL: ${process.env.FRONTEND_URL || 'http://ardbk.com'}`);
  }
});

