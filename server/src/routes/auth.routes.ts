import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  handleValidationErrors,
} from '../middleware/validate.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// ─── Public Routes (with rate limiting) ───────────────────────────────────────
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  authRateLimiter,
  registerValidation,
  handleValidationErrors,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return access token
 * @access  Public
 */
router.post(
  '/login',
  authRateLimiter,
  loginValidation,
  handleValidationErrors,
  login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear refresh token
 * @access  Public (clears cookie)
 */
router.post('/logout', logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Get a new access token using refresh token cookie
 * @access  Public (requires valid refresh token cookie)
 */
router.post('/refresh', refreshToken);

// ─── Protected Routes ──────────────────────────────────────────────────────────
/**
 * @route   GET /api/auth/profile
 * @desc    Get current authenticated user's profile
 * @access  Private
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current authenticated user's profile
 * @access  Private
 */
router.put(
  '/profile',
  protect,
  updateProfileValidation,
  handleValidationErrors,
  updateProfile
);

export default router;
