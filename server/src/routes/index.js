import express from 'express';
import mongoose from 'mongoose';
import * as projectController from '../controllers/projectController.js';
import * as contactController from '../controllers/contactController.js';
import * as userController from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { authLimiter, contactLimiter } from '../middleware/rateLimiter.js';
import { validateRegistration, validateLogin, validateContact } from '../middleware/validation.js';
import { cacheMiddleware, clearCache } from '../middleware/cache.js';

const router = express.Router();

// Health check endpoint - for monitoring and load balancers
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    }[dbState] || 'unknown';

  const memory = process.memoryUsage();

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    memory: {
      used: Math.round(memory.heapUsed / 1024 / 1024),
      total: Math.round(memory.heapTotal / 1024 / 1024),
      unit: 'MB',
    },
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Project routes - CRUD operations with caching
// GET cached for 10 minutes, write operations clear cache
router.get('/projects', cacheMiddleware(600), projectController.getProjects);
router.get('/projects/:id', cacheMiddleware(300), projectController.getProjectById);
router.post(
  '/projects',
  protect,
  adminOnly,
  (req, res, next) => {
    clearCache('/projects');
    next();
  },
  projectController.createProject
);
router.put(
  '/projects/:id',
  protect,
  adminOnly,
  (req, res, next) => {
    clearCache('/projects');
    clearCache(`/projects/${req.params.id}`);
    next();
  },
  projectController.updateProject
);
router.delete(
  '/projects/:id',
  protect,
  adminOnly,
  (req, res, next) => {
    clearCache('/projects');
    clearCache(`/projects/${req.params.id}`);
    next();
  },
  projectController.deleteProject
);

// Contact routes - public submission + admin management
// GET cached for 2 minutes (admin queries change frequently)
router.post('/contact', contactLimiter, validateContact, contactController.submitContactForm);
router.get(
  '/contact',
  protect,
  adminOnly,
  cacheMiddleware(120),
  contactController.getAllContactMessages
);
router.patch(
  '/contact/:id',
  protect,
  adminOnly,
  (req, res, next) => {
    clearCache('/contact');
    next();
  },
  contactController.markMessageAsRead
);
router.delete(
  '/contact/:id',
  protect,
  adminOnly,
  (req, res, next) => {
    clearCache('/contact');
    next();
  },
  contactController.deleteContactMessage
);

// User routes - authentication endpoints have strict rate limiting + input validation
// User list cached for 5 minutes (admin only)
router.post('/users/register', authLimiter, validateRegistration, userController.registerUser);
router.post('/users/login', authLimiter, validateLogin, userController.loginUser);
router.get('/users/profile', protect, userController.getUserProfile);
router.get('/users', protect, adminOnly, cacheMiddleware(300), userController.getAllUsers);

export default router;
