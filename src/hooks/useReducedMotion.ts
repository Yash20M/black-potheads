import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion or is on a low-end device
 * Returns true if animations should be reduced/disabled
 */
export const useReducedMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check user preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceMotion;
};

/**
 * Hook to detect device performance level
 * Returns 'high', 'medium', or 'low'
 */
export const useDevicePerformance = () => {
  const [performance, setPerformance] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4;
    
    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Check connection speed (if available)
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType || '4g';
    
    // Determine performance level
    if (cores <= 2 || memory <= 2 || effectiveType === '2g' || effectiveType === 'slow-2g') {
      setPerformance('low');
    } else if (cores <= 4 || memory <= 4 || effectiveType === '3g') {
      setPerformance('medium');
    } else {
      setPerformance('high');
    }
  }, []);

  return performance;
};

/**
 * Get animation config based on device performance
 */
export const useAnimationConfig = () => {
  const shouldReduceMotion = useReducedMotion();
  const devicePerformance = useDevicePerformance();

  if (shouldReduceMotion) {
    return {
      duration: 0,
      delay: 0,
      enabled: false,
    };
  }

  switch (devicePerformance) {
    case 'low':
      return {
        duration: 0.2,
        delay: 0,
        enabled: true,
      };
    case 'medium':
      return {
        duration: 0.3,
        delay: 0.03,
        enabled: true,
      };
    case 'high':
    default:
      return {
        duration: 0.4,
        delay: 0.05,
        enabled: true,
      };
  }
};
