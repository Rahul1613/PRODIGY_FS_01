import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import {
  AuthRequest,
  RegisterBody,
  LoginBody,
  UpdateProfileBody,
  SafeUser,
} from '../types/auth.types';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshCookieOptions,
} from '../utils/jwt.utils';
import { successResponse, errorResponse } from '../utils/response.utils';

// ─── Register ──────────────────────────────────────────────────────────────────
/**
 * POST /api/auth/register
 * Creates a new user account.
 */
export const register = async (
  req: Request<object, object, RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errorResponse(res, 'An account with this email already exists', 409);
      return;
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({ fullName, email, password, role: 'user' });

    // Generate tokens
    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in DB (hashed storage omitted for brevity; stored as is)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions(false));

    const safeUser: SafeUser = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    successResponse(res, 'Account created successfully', { user: safeUser, accessToken }, 201);
  } catch (error) {
    next(error);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────────
/**
 * POST /api/auth/login
 * Authenticates a user and returns tokens.
 */
export const login = async (
  req: Request<object, object, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, rememberMe = false } = req.body;

    // Fetch user with password (normally excluded by schema)
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) {
      errorResponse(res, 'Invalid email or password', 401);
      return;
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      errorResponse(res, 'Invalid email or password', 401);
      return;
    }

    // Generate tokens
    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Update refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in cookie (longer expiry if rememberMe)
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions(rememberMe));

    const safeUser: SafeUser = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    successResponse(res, 'Login successful', { user: safeUser, accessToken });
  } catch (error) {
    next(error);
  }
};

// ─── Logout ────────────────────────────────────────────────────────────────────
/**
 * POST /api/auth/logout
 * Clears the refresh token cookie and invalidates the session.
 */
export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (refreshToken) {
      // Remove refresh token from DB to invalidate it
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: '' } }
      );
    }

    // Clear the cookie
    res.clearCookie('refreshToken', { path: '/api/auth' });

    successResponse(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// ─── Refresh Token ─────────────────────────────────────────────────────────────
/**
 * POST /api/auth/refresh
 * Issues a new access token using a valid refresh token from the cookie.
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;

    if (!token) {
      errorResponse(res, 'No refresh token provided', 401);
      return;
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(token);

    // Ensure it matches what's stored in DB (token rotation check)
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      errorResponse(res, 'Invalid refresh token. Please log in again.', 401);
      return;
    }

    // Issue new access token
    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(payload);

    successResponse(res, 'Token refreshed', { accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

// ─── Get Profile ───────────────────────────────────────────────────────────────
/**
 * GET /api/auth/profile
 * Returns the authenticated user's profile.
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);

    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    const safeUser: SafeUser = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    successResponse(res, 'Profile retrieved successfully', { user: safeUser });
  } catch (error) {
    next(error);
  }
};

// ─── Update Profile ────────────────────────────────────────────────────────────
/**
 * PUT /api/auth/profile
 * Updates the authenticated user's profile (fullName, email).
 */
export const updateProfile = async (
  req: AuthRequest & { body: UpdateProfileBody },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, email } = req.body;

    // Check if new email is already taken by another user
    if (email) {
      const emailTaken = await User.findOne({
        email,
        _id: { $ne: req.user!.id },
      });
      if (emailTaken) {
        errorResponse(res, 'This email is already in use by another account', 409);
        return;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { ...(fullName && { fullName }), ...(email && { email }) },
      { new: true, runValidators: true }
    );

    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    const safeUser: SafeUser = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    successResponse(res, 'Profile updated successfully', { user: safeUser });
  } catch (error) {
    next(error);
  }
};
