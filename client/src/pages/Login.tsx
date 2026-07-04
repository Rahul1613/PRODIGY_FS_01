import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Component ────────────────────────────────────────────────────────────────
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/dashboard';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const password = watch('password');

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? 'Login failed. Please try again.';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1.5">Welcome back</h1>
          <p className="text-sm text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            error={errors.email?.message}
            success={!errors.email && !!watch('email')}
            leftIcon={
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            {...register('email')}
          />

          <Input
            label="Password"
            showPasswordToggle
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            success={!errors.password && !!password}
            leftIcon={
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            {...register('password')}
          />

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register('rememberMe')}
                />
                <div className="w-4 h-4 rounded border border-white/20 bg-white/5 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all duration-200 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
            </label>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            className="mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="divider text-xs">
          Don't have an account?
        </div>

        {/* Sign up link */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Link to="/register">
            <Button variant="secondary" fullWidth size="md">
              Create Account
            </Button>
          </Link>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default Login;
