import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const features = [
  {
    icon: '🔐',
    title: 'JWT Authentication',
    desc: 'Dual-token strategy with short-lived access tokens and secure refresh tokens stored in httpOnly cookies.',
  },
  {
    icon: '🛡️',
    title: 'bcrypt Hashing',
    desc: 'Passwords are hashed with bcrypt at 12 salt rounds. Plain text passwords are never stored.',
  },
  {
    icon: '⚡',
    title: 'Protected Routes',
    desc: 'Middleware-based route protection with role-based access control for fine-grained permissions.',
  },
  {
    icon: '🔒',
    title: 'Helmet Security',
    desc: 'HTTP security headers via Helmet.js including CSP, HSTS, and XSS protection.',
  },
  {
    icon: '🚦',
    title: 'Rate Limiting',
    desc: 'Brute-force protection with express-rate-limit on all authentication endpoints.',
  },
  {
    icon: '✅',
    title: 'Input Validation',
    desc: 'Server-side validation with express-validator and client-side validation with Zod.',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => {
  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow orbs */}
        <div className="glow-orb w-[600px] h-[600px] bg-indigo-600/10 top-[-20%] left-1/2 -translate-x-1/2" />
        <div className="glow-orb w-80 h-80 bg-purple-600/10 bottom-0 right-[10%]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-300 border border-indigo-500/20 bg-indigo-500/10 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Prodigy InfoTech Internship — Task 01
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight"
          >
            Secure User
            <br />
            <span className="gradient-text">Authentication</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Production-ready authentication system with JWT tokens, bcrypt password hashing, 
            role-based access control, and a premium SaaS-grade interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button size="lg" rightIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Tech stack pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-2"
          >
            {['React 19', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'JWT', 'bcrypt', 'Tailwind CSS'].map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium text-gray-400 border border-white/8 bg-white/3">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built with <span className="gradient-text">Security First</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Every layer of this application is designed with industry-standard security practices.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <div className="glass-card glass-card-hover p-6 h-full">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="glow-orb w-64 h-64 bg-indigo-600/15 top-[-30%] right-[-10%]" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-gray-400 mb-8">Create your account and experience the authentication system.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register">
                  <Button size="lg">Create Account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6 text-center">
        <p className="text-sm text-gray-600">
          © 2024 PRODIGY_FS_01 — Secure User Authentication · Built for Prodigy InfoTech Internship
        </p>
      </footer>
    </div>
  );
};

export default Home;
