import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const ScrollingText = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-50%', '0%']);

  return (
    <section ref={containerRef} className="py-24 bg-background overflow-hidden">
      <div className="space-y-8">
        <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="font-display text-[12vw] text-foreground/5 mx-8">
              BLACK POTHEADS • DARK PRINTS • REBEL WEAR •
            </span>
          ))}
        </motion.div>

        <motion.div style={{ x: x2 }} className="flex whitespace-nowrap">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="font-display text-[12vw] text-primary/10 mx-8">
              SKULLS • GOTHIC • TRIBAL • GRAFFITI •
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
