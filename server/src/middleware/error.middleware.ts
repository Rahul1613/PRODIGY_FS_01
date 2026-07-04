import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.utils';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

/**
 * Global error handling middleware.
 * Must be registered last in the Express app (after all routes).
 */
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'An account with this email already exists';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err);
  }

  errorResponse(res, message, statusCode);
};

/**
 * 404 Not Found middleware for unmatched routes.
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
