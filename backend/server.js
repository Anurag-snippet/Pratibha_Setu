const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler.middleware');

// Route handlers
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const academicianRoutes = require('./routes/academician.routes');
const industryRoutes = require('./routes/industry.routes');
const institutionRoutes = require('./routes/institution.routes');
const opportunityRoutes = require('./routes/opportunity.routes');
const applicationRoutes = require('./routes/application.routes');
const portfolioRoutes = require('./routes/portfolio.routes');
const documentRoutes = require('./routes/document.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const skillRoutes = require('./routes/skill.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

// Enable CORS for frontend origin (supports localhost:8080, 5173, 3000, and configured env origins)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/localhost:[0-9]+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:[0-9]+$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked for this origin.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// HTTP Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static file serving for uploads (/uploads/resumes, /uploads/certificates, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pratibha Setu REST API is active and running',
    timestamp: new Date().toISOString(),
    databaseStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/academicians', academicianRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/notifications', notificationRoutes);

// Catch 404 for unhandled API routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🌿 Pratibha Setu REST API Server Started`);
      console.log(`🚀 Listening on Port: ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Allowed CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log('[Server] HTTP server closed.');
    });
  }
  try {
    await mongoose.connection.close(false);
    console.log('[MongoDB] Connection closed.');
    process.exit(0);
  } catch (err) {
    console.error(`[MongoDB] Error during connection close: ${err.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// If run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
