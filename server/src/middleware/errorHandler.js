/**
 * @desc    Centralized error handling middleware
 * Catches all errors and returns consistent response format
 * Logs errors in development, sanitizes in production
 */
export const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.error('❌ Error occurred:');
  console.error(`   Timestamp: ${new Date().toISOString()}`);
  console.error(`   Method: ${req.method}`);
  console.error(`   Path: ${req.path}`);
  console.error(`   Error: ${err.name}: ${err.message}`);

  if (process.env.NODE_ENV !== 'production') {
    console.error(`   Stack: ${err.stack}`);
  }

  // Determine status code
  let statusCode = err.statusCode || err.status || 500;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'CastError') {
    statusCode = 400;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
  }

  // Sanitize message for client (don't leak internal details in production)
  let message = err.message;
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  // Consistent error response structure
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
      details: err,
    }),
  });
};

/**
 * @desc    404 Not Found handler
 * Catches requests to undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
