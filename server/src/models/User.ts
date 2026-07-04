import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/auth.types';

const SALT_ROUNDS = 12;

// ─── User Schema ───────────────────────────────────────────────────────────────
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },
    refreshToken: {
      type: String,
      select: false, // Never return refreshToken in queries by default
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: {
      transform: function (_doc, ret: Record<string, unknown>) {
        // Remove sensitive fields from JSON output
        delete ret['password'];
        delete ret['refreshToken'];
        delete ret['__v'];
        ret['id'] = ret['_id'];
        delete ret['_id'];
        return ret;
      },
    },
  }
);

// ─── Pre-save Hook: Hash Password ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ─── Instance Method: Compare Password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Indexes ───────────────────────────────────────────────────────────────────
// Note: email index is already created by `unique: true` in the schema definition
userSchema.index({ createdAt: -1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
