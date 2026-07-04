import jwt from 'jsonwebtoken';
import { IUserPayload } from '../types/auth.types';

// ─── Generate Access Token ─────────────────────────────────────────────────────
export const generateAccessToken = (payload: IUserPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET!;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES || '15m';

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

// ─── Generate Refresh Token ────────────────────────────────────────────────────
export const generateRefreshToken = (payload: IUserPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET!;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES || '7d';

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

// ─── Verify Access Token ───────────────────────────────────────────────────────
export const verifyAccessToken = (token: string): IUserPayload => {
  const secret = process.env.JWT_ACCESS_SECRET!;
  return jwt.verify(token, secret) as IUserPayload;
};

// ─── Verify Refresh Token ──────────────────────────────────────────────────────
export const verifyRefreshToken = (token: string): IUserPayload => {
  const secret = process.env.JWT_REFRESH_SECRET!;
  return jwt.verify(token, secret) as IUserPayload;
};

// ─── Cookie Options ────────────────────────────────────────────────────────────
export const getRefreshCookieOptions = (rememberMe = false) => ({
  httpOnly: true,          // Not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict' as const,
  maxAge: rememberMe
    ? 7 * 24 * 60 * 60 * 1000   // 7 days
    : 24 * 60 * 60 * 1000,       // 1 day (session-like)
  path: '/api/auth',
});
