import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Detect background color under cursor
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const bgColor = window.getComputedStyle(element).backgroundColor;
        const isDark = isColorDark(bgColor);
        setIsDarkBackground(isDark);
      }
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  // Function to determine if a color is dark
  const isColorDark = (color: string): boolean => {
    // Handle rgba/rgb colors
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      
      // Calculate relative luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // If luminance is less than 0.5, it's a dark color
      return luminance < 0.5;
    }
    
    // Default to dark if we can't parse
    return true;
  };

  // Hide on touch devices and mobile
  if (!isMounted) return null;
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  if (isTouchDevice || isMobile) return null;

  const logoSrc = isDarkBackground ? '/logo.png' : '/white_logo.png';

  return (
    <>
      {/* Main cursor with logo image - no animation */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <img
          src={logoSrc}
          alt="Cursor"
          style={{
            width: 58,
            height: 58,
          }}
          className="object-contain"
        />
      </motion.div>

      <style>{`
        @media (min-width: 768px) and (hover: hover) and (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
};
