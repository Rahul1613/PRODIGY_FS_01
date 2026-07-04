import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import Button from '../components/Button';

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const Dashboard = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const user = state.user!;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stats = [
    {
      label: 'Account Role',
      value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      icon: '👤',
      badge: user.role === 'admin' ? 'badge-admin' : 'badge-user',
    },
    {
      label: 'Member Since',
      value: formatDate(user.createdAt),
      icon: '📅',
    },
    {
      label: 'Email',
      value: user.email,
      icon: '✉️',
    },
    {
      label: 'Account Status',
      value: 'Active',
      icon: '✅',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ── Welcome Banner ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className="glow-orb w-64 h-64 bg-indigo-600/10 top-[-50%] right-[-5%]" />
        <div className="glow-orb w-48 h-48 bg-purple-600/8 bottom-[-30%] left-[10%]" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar name={user.fullName} size="xl" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-indigo-400 font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">
              {user.fullName}
            </h1>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
            <div className="mt-3">
              <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
          <Button
            variant="danger"
            onClick={handleLogout}
            isLoading={loggingOut}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            }
          >
            Logout
          </Button>
        </div>
      </motion.div>

      {/* ── Stats Grid ──────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Account Information</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="glass-card-hover" padding="md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                    <p className="text-sm font-semibold text-white truncate">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Security Info ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Security Overview</h2>
        <Card padding="md">
          <div className="space-y-3">
            {[
              { label: 'Password', value: '••••••••••••', status: 'Bcrypt hashed (12 rounds)', ok: true },
              { label: 'Session', value: 'JWT Token', status: 'Active — expires in 15 minutes', ok: true },
              { label: 'Refresh Token', value: 'httpOnly Cookie', status: '7-day expiry', ok: true },
              { label: 'Two-Factor Auth', value: 'Not configured', status: 'Optional enhancement', ok: false },
            ].map(({ label, value, status, ok }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-gray-500">{value}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium ${ok ? 'text-green-400' : 'text-gray-500'}`}>
                    {ok ? '✓ ' : ''}{status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
