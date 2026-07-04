import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-mesh flex">
      {/* ── Left Brand Panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col items-center justify-center px-12">
        {/* Animated glow orbs */}
        <div className="glow-orb w-96 h-96 bg-indigo-600/20 top-[-20%] left-[-20%]" />
        <div className="glow-orb w-80 h-80 bg-purple-600/15 bottom-[-10%] right-[-10%]" />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-10"
          >
            <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-5 shadow-lg float-slow">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <Link to="/" className="text-2xl font-bold text-white">
              Prodigy<span className="gradient-text">Auth</span>
            </Link>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-white leading-tight mb-4"
          >
            Enterprise-Grade
            <br />
            <span className="gradient-text">Authentication</span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-base leading-relaxed mb-10"
          >
            Secure, fast, and scalable authentication built for modern applications. 
            JWT tokens, bcrypt encryption, and role-based access control.
          </motion.p>

          {/* Feature list */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3 text-left"
          >
            {[
              { icon: '🔐', text: 'JWT Access & Refresh Tokens' },
              { icon: '🛡️', text: 'bcrypt Password Hashing' },
              { icon: '⚡', text: 'Protected Routes & Middleware' },
              { icon: '👤', text: 'Role-Based Access Control' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-base">
                  {icon}
                </div>
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right Form Panel ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-8 lg:px-12 relative">
        {/* Background effects */}
        <div className="glow-orb w-72 h-72 bg-indigo-600/10 top-[-10%] right-0" />
        <div className="glow-orb w-48 h-48 bg-purple-600/10 bottom-[5%] left-[5%]" />

        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-bold text-white text-xl">
              Prodigy<span className="gradient-text">Auth</span>
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-card p-8 md:p-10">
            {children}
          </div>
        </motion.div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-600">
          PRODIGY_FS_01 — Secure Authentication System
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
