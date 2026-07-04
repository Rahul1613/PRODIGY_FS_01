import api from './api';
import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ApiResponse,
  AuthResponse,
  User,
} from '../types/auth.types';

// ─── Register ──────────────────────────────────────────────────────────────────
export const registerUser = async (
  payload: RegisterPayload
): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
  return data;
};

// ─── Login ─────────────────────────────────────────────────────────────────────
export const loginUser = async (
  payload: LoginPayload
): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
  return data;
};

// ─── Logout ────────────────────────────────────────────────────────────────────
export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// ─── Get Profile ───────────────────────────────────────────────────────────────
export const getProfile = async (): Promise<ApiResponse<{ user: User }>> => {
  const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
  return data;
};

// ─── Update Profile ────────────────────────────────────────────────────────────
export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<ApiResponse<{ user: User }>> => {
  const { data } = await api.put<ApiResponse<{ user: User }>>('/auth/profile', payload);
  return data;
};

// ─── Refresh Token ─────────────────────────────────────────────────────────────
export const refreshAccessToken = async (): Promise<string> => {
  const { data } = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
  return data.data!.accessToken;
};
