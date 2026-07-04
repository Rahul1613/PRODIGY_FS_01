import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  animate = false,
}: CardProps) => {
  const classes = `glass-card ${paddings[padding]} ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={classes}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={classes}>{children}</div>;
};

export default Card;
