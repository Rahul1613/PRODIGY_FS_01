// ─── User Types ────────────────────────────────────────────────────────────────
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth State ─────────────────────────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Auth Actions ───────────────────────────────────────────────────────────────
export type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; accessToken: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_TOKEN'; payload: string };

// ─── Auth Context ───────────────────────────────────────────────────────────────
export interface AuthContextType {
  state: AuthState;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateProfilePayload) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Form Payloads ──────────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
}

// ─── API Response ───────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
