import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import Button from './Button';

const Navbar = () => {
  const { state } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/#features' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.8)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center shadow-lg">
              <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Prodigy<span className="gradient-text">Auth</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.to
                    ? 'text-indigo-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {state.isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 overflow-hidden"
            style={{ background: 'rgba(10,10,15,0.95)' }}
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm font-medium text-gray-400 hover:text-white py-1.5"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                {state.isAuthenticated ? (
                  <Link to="/dashboard" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Button fullWidth size="sm">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="secondary" fullWidth size="sm">Sign In</Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button fullWidth size="sm">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
