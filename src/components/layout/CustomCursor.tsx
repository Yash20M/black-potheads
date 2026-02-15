import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  // Slower spring config for smoother cursor movement
  const springConfig = { damping: 20, stiffness: 140 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

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

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
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

  // Hide on touch devices
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
  if (isTouchDevice) return null;

  const logoSrc = isDarkBackground ? '/logo.png' : '/white_logo.png';

  return (
    <>
      {/* Main cursor with logo image */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={logoSrc}
            src={logoSrc}
            alt="Cursor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              width: isHovering ? 64 : 58,
              height: isHovering ? 64 : 58,
            }}
            className="object-contain"
            onAnimationComplete={() => {}}
          />
        </AnimatePresence>
      </motion.div>

      {/* Trailing glow effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: useSpring(cursorX, { damping: 35, stiffness: 80 }),
          y: useSpring(cursorY, { damping: 35, stiffness: 80 }),
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 80 : 64,
            height: isHovering ? 80 : 64,
            opacity: isHovering ? 0.4 : 0.2,
          }}
          transition={{ duration: 0.2 }}
          className="rounded-full blur-xl"
          style={{
            background: isDarkBackground 
              ? 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)'
              : 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)'
          }}
        />
      </motion.div>

      {/* Second trail with logo */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: useSpring(cursorX, { damping: 40, stiffness: 60 }),
          y: useSpring(cursorY, { damping: 40, stiffness: 60 }),
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={logoSrc}
            src={logoSrc}
            alt="Cursor Trail"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 0.4 : 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              width: isHovering ? 56 : 40,
              height: isHovering ? 56 : 40,
            }}
            className="object-contain"
          />
        </AnimatePresence>
      </motion.div>

      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
};
