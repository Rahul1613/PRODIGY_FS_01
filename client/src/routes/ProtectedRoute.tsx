import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SkeletonLoader from '../components/SkeletonLoader';

/**
 * ProtectedRoute
 * Renders the child routes if the user is authenticated.
 * Redirects to /login with the current path as state if not authenticated.
 * Shows a skeleton loader while the auth state is being determined.
 */
const ProtectedRoute = () => {
  const { state } = useAuth();
  const location = useLocation();

  if (state.isLoading) {
    return <SkeletonLoader fullPage />;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
