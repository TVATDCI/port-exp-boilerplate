import rateLimit from 'express-rate-limit';

/**
 * @desc    Strict rate limiting for authentication endpoints
 * Prevents brute force attacks on login/registration
 * @access  Public (but limited)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * @desc    Moderate rate limiting for contact form
 * Prevents spam and abuse of contact endpoint
 * @access  Public (but limited)
 */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 submissions per hour
  message: {
    error: 'Too many contact submissions. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @desc    General API rate limiting
 * Prevents general API abuse and scraping
 * @access  Public (but limited)
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
