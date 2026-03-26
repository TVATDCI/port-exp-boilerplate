import express from 'express';
import { getProjects } from '../controllers/projectController.js';
import { submitContactForm } from '../controllers/contactController.js'; // Import contact controller

const router = express.Router();

// Route for getting all projects
router.get('/projects', getProjects);

// Route for contact form submission
router.post('/contact', submitContactForm);

export default router;
