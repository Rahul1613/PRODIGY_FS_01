import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import PasswordStrength from '../components/PasswordStrength';
import useAuth from '../hooks/useAuth';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[\W_]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Component ────────────────────────────────────────────────────────────────
const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await registerUser(data);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverErrors = error.response?.data?.errors as string[] | undefined;
        if (serverErrors && serverErrors.length > 0) {
          serverErrors.forEach((err) => toast.error(err));
        } else {
          const message = error.response?.data?.message ?? 'Registration failed. Please try again.';
          toast.error(message);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1.5">Create your account</h1>
          <p className="text-sm text-gray-400">
            Join thousands of developers building secure apps
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            required
            error={errors.fullName?.message}
            success={!errors.fullName && !!watch('fullName')}
            leftIcon={
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            {...register('fullName')}
          />

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

          <div>
            <Input
              label="Password"
              showPasswordToggle
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
              error={errors.password?.message}
              leftIcon={
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              {...register('password')}
            />
            <PasswordStrength password={password} />
          </div>

          <Input
            label="Confirm Password"
            showPasswordToggle
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
            error={errors.confirmPassword?.message}
            leftIcon={
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            className="mt-2"
          >
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="divider text-xs">
          Already have an account?
        </div>

        {/* Sign in link */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Link to="/login">
            <Button variant="secondary" fullWidth size="md">
              Sign In Instead
            </Button>
          </Link>
        </motion.div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-600">
          By creating an account, you agree to our{' '}
          <span className="text-indigo-400 cursor-pointer hover:underline">Terms of Service</span>{' '}
          and{' '}
          <span className="text-indigo-400 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
