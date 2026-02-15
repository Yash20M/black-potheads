import { motion, useScroll, useTransform } from 'framer-motion';
import { Skull } from 'lucide-react';

interface SkullLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const SkullLogo = ({ size = 'md', animated = true }: SkullLogoProps) => {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1000], [0, 360]);
  const glowOpacity = useTransform(scrollY, [0, 300, 600], [0.3, 1, 0.3]);

  const sizeMap = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-5xl' },
    xl: { icon: 80, text: 'text-8xl' },
  };

  const { icon: iconSize, text: textClass } = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <motion.div
        style={animated ? { rotate } : undefined}
        className="relative"
      >
        {/* Glow effect */}
        {animated && (
          <motion.div
            style={{ opacity: glowOpacity }}
            className="absolute inset-0 blur-lg"
          >
            <Skull size={iconSize} className="text-primary" />
          </motion.div>
        )}
        <Skull size={iconSize} className="text-foreground relative z-10" />
      </motion.div>
      <span className={`font-display ${textClass} tracking-wider`}>
        BLACK POTHEADS
      </span>
    </div>
  );
};
