interface SkeletonLoaderProps {
  fullPage?: boolean;
  lines?: number;
  className?: string;
}

const SkeletonLoader = ({ fullPage = false, lines = 3, className = '' }: SkeletonLoaderProps) => {
  if (fullPage) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl skeleton" />
          <div className="space-y-3 w-48">
            <div className="skeleton h-3 rounded-full w-full" />
            <div className="skeleton h-3 rounded-full w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`} aria-busy="true" aria-label="Loading...">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 rounded-full ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

// Dashboard card skeleton
export const CardSkeleton = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="skeleton h-3 rounded-full w-24" />
        <div className="skeleton h-4 rounded-full w-16" />
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
