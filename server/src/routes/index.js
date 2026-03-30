import express from 'express';
import * as projectController from '../controllers/projectController.js';
import * as contactController from '../controllers/contactController.js';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter, contactLimiter } from '../middleware/rateLimiter.js';
import { validateRegistration, validateLogin, validateContact } from '../middleware/validation.js';

const router = express.Router();

// Project routes - CRUD operations
router.get('/projects', projectController.getProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', protect, projectController.createProject);
router.put('/projects/:id', protect, projectController.updateProject);
router.delete('/projects/:id', protect, projectController.deleteProject);

// Contact routes - limited to prevent spam + input validation
router.post('/contact', contactLimiter, validateContact, contactController.submitContactForm);

// User routes - authentication endpoints have strict rate limiting + input validation
router.post('/users/register', authLimiter, validateRegistration, userController.registerUser);
router.post('/users/login', authLimiter, validateLogin, userController.loginUser);
router.get('/users/profile', protect, userController.getUserProfile);

export default router;
