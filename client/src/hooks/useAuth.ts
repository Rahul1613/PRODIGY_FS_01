import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../types/auth.types';

/**
 * Custom hook to access the AuthContext.
 * Must be used within an <AuthProvider> tree.
 */
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;
