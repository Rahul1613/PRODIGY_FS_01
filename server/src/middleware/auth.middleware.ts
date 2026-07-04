import { Response, NextFunction } from 'express';
import { AuthRequest, IUserPayload, UserRole } from '../types/auth.types';
import { verifyAccessToken } from '../utils/jwt.utils';
import { errorResponse } from '../utils/response.utils';

/**
 * Middleware: protect
 * Verifies the JWT access token from the Authorization header.
 * Attaches the decoded user payload to req.user.
 */
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Access denied. No token provided.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      errorResponse(res, 'Access denied. Invalid token format.', 401);
      return;
    }

    // Verify and decode the token
    const decoded = verifyAccessToken(token) as IUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    const err = error as Error;

    if (err.name === 'TokenExpiredError') {
      errorResponse(res, 'Token expired. Please refresh your session.', 401);
      return;
    }

    if (err.name === 'JsonWebTokenError') {
      errorResponse(res, 'Invalid token. Please log in again.', 401);
      return;
    }

    errorResponse(res, 'Authentication failed.', 401);
  }
};

/**
 * Middleware: authorize
 * Restricts access to specific roles.
 * Must be used after the `protect` middleware.
 * 
 * @example router.get('/admin', protect, authorize('admin'), handler)
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Not authenticated.', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      errorResponse(
        res,
        `Access denied. Required role: ${roles.join(' or ')}`,
        403
      );
      return;
    }

    next();
  };
};
