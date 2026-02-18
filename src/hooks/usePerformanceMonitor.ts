import { useEffect } from 'react';

export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Only run in development
    if (import.meta.env.DEV) {
      // Monitor Web Vitals
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
              console.log('CLS:', clsScore);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      }

      // Log navigation timing
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (perfData) {
            console.log('Performance Metrics:', {
              'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
              'TCP Connection': perfData.connectEnd - perfData.connectStart,
              'Request Time': perfData.responseStart - perfData.requestStart,
              'Response Time': perfData.responseEnd - perfData.responseStart,
              'DOM Processing': perfData.domComplete - perfData.domLoading,
              'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
              'Total Time': perfData.loadEventEnd - perfData.fetchStart,
            });
          }
        }, 0);
      });
    }
  }, []);
};
