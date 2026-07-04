import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SkeletonLoader from '../components/SkeletonLoader';

/**
 * PublicRoute
 * Redirects authenticated users away from public-only pages (Login, Register)
 * to the Dashboard. Shows skeleton loader during auth check.
 */
const PublicRoute = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return <SkeletonLoader fullPage />;
  }

  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
