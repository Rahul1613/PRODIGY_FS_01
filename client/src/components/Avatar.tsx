import { useMemo } from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-20 h-20 text-2xl',
};

// Generate a consistent color based on the name
const getAvatarColor = (name: string): string => {
  const colors = [
    'from-indigo-500 to-purple-600',
    'from-purple-500 to-pink-600',
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-indigo-600',
    'from-fuchsia-500 to-purple-600',
    'from-cyan-500 to-blue-600',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index]!;
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Avatar = ({ name, size = 'md', className = '' }: AvatarProps) => {
  const initials = useMemo(() => getInitials(name), [name]);
  const colorClass = useMemo(() => getAvatarColor(name), [name]);

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full font-bold
        bg-gradient-to-br ${colorClass} text-white flex-shrink-0
        ${sizes[size]} ${className}
      `}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
