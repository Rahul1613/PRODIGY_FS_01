import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import type {
  AuthState,
  AuthAction,
  AuthContextType,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from '../types/auth.types';
import {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  updateProfile,
} from '../services/auth.service';

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // Start loading to check persisted session
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'UPDATE_USER':
      return { ...state, user: action.payload };

    case 'UPDATE_TOKEN':
      return { ...state, accessToken: action.payload };

    default:
      return state;
  }
};

// ─── Context ───────────────────────────────────────────────────────────────────
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Token Storage Helpers ─────────────────────────────────────────────────────
const TOKEN_KEY = 'accessToken';

const storeToken = (token: string, remember: boolean) => {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

// ─── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ─── Restore session on app load ────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        dispatch({ type: 'AUTH_FAILURE' });
        return;
      }

      try {
        // Validate token by fetching profile
        const response = await getProfile();
        if (response.success && response.data?.user) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.data.user, accessToken: storedToken },
          });
        } else {
          clearStoredToken();
          dispatch({ type: 'AUTH_FAILURE' });
        }
      } catch {
        clearStoredToken();
        dispatch({ type: 'AUTH_FAILURE' });
      }
    };

    restoreSession();
  }, []);

  // ─── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (payload: LoginPayload) => {
    dispatch({ type: 'AUTH_LOADING' });
    const response = await loginUser(payload);

    if (response.success && response.data) {
      const { user, accessToken } = response.data;
      storeToken(accessToken, payload.rememberMe ?? false);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, accessToken } });
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}! 👋`);
    }
  }, []);

  // ─── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(async (payload: RegisterPayload) => {
    dispatch({ type: 'AUTH_LOADING' });
    const response = await registerUser(payload);

    if (response.success && response.data) {
      const { user, accessToken } = response.data;
      storeToken(accessToken, false);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, accessToken } });
      toast.success(`Account created! Welcome, ${user.fullName.split(' ')[0]}! 🎉`);
    }
  }, []);

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Fail silently — clear locally regardless
    } finally {
      clearStoredToken();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  }, []);

  // ─── Update User ─────────────────────────────────────────────────────────────
  const updateUser = useCallback(async (payload: UpdateProfilePayload) => {
    const response = await updateProfile(payload);
    if (response.success && response.data?.user) {
      dispatch({ type: 'UPDATE_USER', payload: response.data.user as User });
      toast.success('Profile updated successfully!');
    }
  }, []);

  // ─── Refresh User Profile ─────────────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const response = await getProfile();
      if (response.success && response.data?.user) {
        dispatch({ type: 'UPDATE_USER', payload: response.data.user as User });
      }
    } catch {
      // Silent refresh failure
    }
  }, []);

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
