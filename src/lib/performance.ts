// Performance optimization utilities

/**
 * Debounce function to limit how often a function can fire
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function to ensure a function is called at most once per interval
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '50px' }
  );
  
  observer.observe(img);
  return () => observer.disconnect();
};

/**
 * Check if device is mobile
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
};

/**
 * Get optimal animation duration based on device and user preferences
 */
export const getAnimationDuration = (baseDuration: number): number => {
  if (prefersReducedMotion()) return 0;
  if (isMobileDevice()) return baseDuration * 0.7; // 30% faster on mobile
  return baseDuration;
};

/**
 * Request idle callback wrapper with fallback
 */
export const requestIdleCallback = (callback: () => void, timeout = 2000) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout });
  }
  return setTimeout(callback, 1);
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Batch DOM reads and writes for better performance
 */
export class DOMBatcher {
  private readQueue: Array<() => void> = [];
  private writeQueue: Array<() => void> = [];
  private scheduled = false;

  read(callback: () => void) {
    this.readQueue.push(callback);
    this.schedule();
  }

  write(callback: () => void) {
    this.writeQueue.push(callback);
    this.schedule();
  }

  private schedule() {
    if (this.scheduled) return;
    this.scheduled = true;

    requestAnimationFrame(() => {
      // Execute all reads first
      this.readQueue.forEach((cb) => cb());
      this.readQueue = [];

      // Then execute all writes
      this.writeQueue.forEach((cb) => cb());
      this.writeQueue = [];

      this.scheduled = false;
    });
  }
}
