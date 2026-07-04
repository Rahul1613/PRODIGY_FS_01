import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      {/* Glow orbs */}
      <div className="glow-orb w-80 h-80 bg-indigo-600/10 top-[10%] left-[5%]" />
      <div className="glow-orb w-60 h-60 bg-purple-600/10 bottom-[10%] right-[5%]" />

      <div className="text-center relative z-10">
        {/* Animated 404 number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        >
          <h1 className="text-[160px] sm:text-[200px] font-extrabold leading-none gradient-text select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
          <p className="text-gray-400 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link to="/">
              <Button
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
