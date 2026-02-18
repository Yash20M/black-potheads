import { motion } from 'framer-motion';

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="relative w-20 h-20 mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full" />
        </motion.div>
        <motion.p
          className="text-muted-foreground font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
};

export const Spinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-primary/20 rounded-full" style={{ borderWidth: 'inherit' }} />
      <div className="absolute inset-0 border-transparent border-t-primary rounded-full" style={{ borderWidth: 'inherit' }} />
    </motion.div>
  );
};

export const ButtonLoader = () => {
  return (
    <motion.div
      className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-card border border-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-secondary" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-3 bg-secondary rounded w-1/2" />
        <div className="h-8 bg-secondary rounded w-full" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) => {
  return (
    <div className="bg-card border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-secondary">
          <tr>
            {Array(cols).fill(null).map((_, i) => (
              <th key={i} className="p-4">
                <div className="h-4 bg-secondary/50 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows).fill(null).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border">
              {Array(cols).fill(null).map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  <div className="h-4 bg-secondary rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
