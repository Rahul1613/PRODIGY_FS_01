import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import Avatar from '../components/Avatar';
import Button from '../components/Button';

const navItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    to: '/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const DashboardLayout = () => {
  const { state, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold text-white text-base">
            Prodigy<span className="gradient-text">Auth</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                border transition-all duration-200
                ${isActive
                  ? 'nav-item-active border-indigo-500/20'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 mb-2">
          <Avatar name={state.user?.fullName ?? 'User'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{state.user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{state.user?.email}</p>
          </div>
        </div>
        <Button
          variant="danger"
          fullWidth
          size="sm"
          onClick={handleLogout}
          isLoading={loggingOut}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          }
        >
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mesh flex">
      {/* ── Desktop Sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 border-r border-white/5"
        style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)' }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden border-r border-white/5"
              style={{ background: 'rgba(10,10,18,0.98)', backdropFilter: 'blur(20px)' }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 border-b border-white/5 h-16 flex items-center px-4 sm:px-6"
          style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(16px)' }}>
          <button
            className="lg:hidden text-gray-400 hover:text-white mr-3 p-1.5 rounded-lg hover:bg-white/5"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-white">{state.user?.fullName}</p>
              <p className="text-xs text-gray-500">{state.user?.email}</p>
            </div>
            <Avatar name={state.user?.fullName ?? 'User'} size="sm" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
