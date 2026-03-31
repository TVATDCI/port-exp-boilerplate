import express from 'express';
import * as projectController from '../controllers/projectController.js';
import * as contactController from '../controllers/contactController.js';
import * as userController from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { authLimiter, contactLimiter } from '../middleware/rateLimiter.js';
import { validateRegistration, validateLogin, validateContact } from '../middleware/validation.js';

const router = express.Router();

// Project routes - CRUD operations
router.get('/projects', projectController.getProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', protect, adminOnly, projectController.createProject);
router.put('/projects/:id', protect, adminOnly, projectController.updateProject);
router.delete('/projects/:id', protect, adminOnly, projectController.deleteProject);

// Contact routes - public submission + admin management
router.post('/contact', contactLimiter, validateContact, contactController.submitContactForm);
router.get('/contact', protect, adminOnly, contactController.getAllContactMessages);
router.patch('/contact/:id', protect, adminOnly, contactController.markMessageAsRead);
router.delete('/contact/:id', protect, adminOnly, contactController.deleteContactMessage);

// User routes - authentication endpoints have strict rate limiting + input validation
router.post('/users/register', authLimiter, validateRegistration, userController.registerUser);
router.post('/users/login', authLimiter, validateLogin, userController.loginUser);
router.get('/users/profile', protect, userController.getUserProfile);
router.get('/users', protect, adminOnly, userController.getAllUsers);

export default router;
