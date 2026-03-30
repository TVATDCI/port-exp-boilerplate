import { body, validationResult } from 'express-validator';

/**
 * @desc    Middleware to handle validation errors
 * Checks for validation errors and returns 400 with error details if found
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

/**
 * @desc    Validation rules for user registration
 * Prevents privilege escalation, weak passwords, and invalid emails
 */
export const validateRegistration = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),

  body('role').optional().isIn(['user']).withMessage('Invalid role specified'),

  handleValidationErrors,
];

/**
 * @desc    Validation rules for user login
 * Ensures email format is valid
 */
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password').notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

/**
 * @desc    Validation rules for contact form submission
 * Prevents XSS, empty submissions, and spam
 */
export const validateContact = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape() // Sanitizes HTML to prevent XSS
    .withMessage('Name contains invalid characters'),

  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .escape() // Sanitizes HTML to prevent XSS
    .withMessage('Message contains invalid characters'),

  handleValidationErrors,
];
