import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLoader } from './ui/loader';

/**
 * Component to handle route transitions smoothly
 * Shows a brief loader when navigating to prevent blank screens
 */
export const RouteTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Show loader briefly on route change
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 150); // Very brief, just enough to prevent blank screen

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isTransitioning) {
    return <PageLoader />;
  }

  return <>{children}</>;
};
