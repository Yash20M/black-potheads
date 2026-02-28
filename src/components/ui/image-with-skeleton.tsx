import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string;
  skeletonClassName?: string;
}

export const ImageWithSkeleton = ({
  src,
  alt,
  className,
  aspectRatio = 'aspect-[3/4]',
  skeletonClassName,
  onError,
  ...props
}: ImageWithSkeletonProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <div className={cn('relative overflow-hidden', aspectRatio)}>
      {/* Skeleton Loader */}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer',
            skeletonClassName
          )}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      )}
    </div>
  );
};
