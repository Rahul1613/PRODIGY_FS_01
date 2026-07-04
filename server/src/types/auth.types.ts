import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── User Role Enum ────────────────────────────────────────────────────────────
export type UserRole = 'user' | 'admin';

// ─── Mongoose User Document Interface ─────────────────────────────────────────
export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── JWT Payload ───────────────────────────────────────────────────────────────
export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
}

// ─── Authenticated Request (extends Express Request) ──────────────────────────
export interface AuthRequest extends Request {
  user?: IUserPayload;
}

// ─── Request Body Types ────────────────────────────────────────────────────────
export interface RegisterBody {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginBody {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UpdateProfileBody {
  fullName?: string;
  email?: string;
}

// ─── Standard API Response ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// ─── Safe User (no password, no refreshToken) ──────────────────────────────────
export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
