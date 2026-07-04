import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'btn-gradient text-white',
  secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200',
  ghost: 'text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200',
  danger: 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-200',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <motion.div
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className="inline-flex"
    >
      <button
        className={`
          inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold
          cursor-pointer select-none transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 focus:ring-offset-transparent
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    </motion.div>
  );
};

export default Button;
