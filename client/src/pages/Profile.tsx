import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Avatar from '../components/Avatar';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ─── Component ────────────────────────────────────────────────────────────────
const Profile = () => {
  const { state, updateUser } = useAuth();
  const user = state.user!;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateUser(data);
      reset(data); // Reset dirty state
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? 'Update failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
        <p className="text-sm text-gray-400">Manage your personal information and account details</p>
      </motion.div>

      {/* ── Profile Card ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card padding="md" className="flex flex-col sm:flex-row items-center gap-5">
          <Avatar name={user.fullName} size="xl" />
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold text-white">{user.fullName}</h2>
            <p className="text-sm text-gray-400 mb-2">{user.email}</p>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <span className="text-xs text-gray-600">·</span>
              <span className="text-xs text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Edit Form ────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card padding="lg">
          <h3 className="text-base font-semibold text-white mb-5">Edit Information</h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Your full name"
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
              label="Email Address"
              type="email"
              placeholder="your@email.com"
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

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!isDirty}
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={!isDirty}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* ── Account Details ──────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card padding="md">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Account Details</h3>
          <div className="space-y-3">
            {[
              { label: 'User ID', value: user.id },
              { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
              { label: 'Account Created', value: formatDate(user.createdAt) },
              { label: 'Last Updated', value: formatDate(user.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
                <span className="text-sm text-white text-right font-mono break-all">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
