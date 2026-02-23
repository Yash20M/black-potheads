import { motion } from 'framer-motion';

// Damru SVG - Shiva's sacred hourglass drum with ropes and beads
const DamruSVG = () => (
  <svg
    viewBox="0 0 200 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Glow filter */}
    <defs>
      <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="strongGlow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="12" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="drumGrad1" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#d4a017" />
        <stop offset="40%" stopColor="#b8860b" />
        <stop offset="100%" stopColor="#7a5500" />
      </radialGradient>
      <radialGradient id="drumGrad2" cx="50%" cy="60%" r="60%">
        <stop offset="0%" stopColor="#d4a017" />
        <stop offset="40%" stopColor="#b8860b" />
        <stop offset="100%" stopColor="#7a5500" />
      </radialGradient>
      <linearGradient id="stickGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8B4513" />
        <stop offset="50%" stopColor="#D2691E" />
        <stop offset="100%" stopColor="#8B4513" />
      </linearGradient>
      <radialGradient id="beadGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FF6B35" />
        <stop offset="100%" stopColor="#CC3300" />
      </radialGradient>
      <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
      <linearGradient id="metalRing" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#CC8800" />
      </linearGradient>
    </defs>

    {/* Handle / Stick */}
    <rect x="94" y="10" width="12" height="240" rx="6" fill="url(#stickGrad)" />
    <rect x="97" y="10" width="3" height="240" rx="2" fill="#E8945A" opacity="0.5" />

    {/* Top drum head (upper triangle of hourglass) */}
    {/* Upper drum body */}
    <ellipse cx="100" cy="80" rx="52" ry="14" fill="url(#drumGrad1)" filter="url(#glow)" />
    <path d="M 48 80 L 82 125 L 118 125 L 152 80 Z" fill="url(#drumGrad1)" />
    {/* Top drum face */}
    <ellipse cx="100" cy="80" rx="52" ry="14" fill="#b8860b" />
    <ellipse cx="100" cy="80" rx="46" ry="11" fill="#d4a017" />
    <ellipse cx="100" cy="80" rx="38" ry="8" fill="#c8950e" />
    {/* Drum skin texture circles */}
    <circle cx="100" cy="80" r="28" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.4" />
    <circle cx="100" cy="80" r="18" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.3" />
    {/* Om symbol suggestion */}
    <text x="100" y="83" textAnchor="middle" fontSize="14" fill="#FFD700" opacity="0.6" fontFamily="serif">ॐ</text>

    {/* Metal ring top */}
    <ellipse cx="100" cy="80" rx="52" ry="14" fill="none" stroke="url(#metalRing)" strokeWidth="4" />

    {/* Waist / Middle of hourglass */}
    <ellipse cx="100" cy="125" rx="18" ry="6" fill="#8B6914" />
    <ellipse cx="100" cy="125" rx="18" ry="6" fill="none" stroke="url(#metalRing)" strokeWidth="3" />

    {/* Lower drum body */}
    <path d="M 82 125 L 48 170 L 152 170 L 118 125 Z" fill="url(#drumGrad2)" />
    {/* Bottom drum face */}
    <ellipse cx="100" cy="170" rx="52" ry="14" fill="#b8860b" />
    <ellipse cx="100" cy="170" rx="46" ry="11" fill="#d4a017" />
    <ellipse cx="100" cy="170" rx="38" ry="8" fill="#c8950e" />
    {/* Drum skin texture circles */}
    <circle cx="100" cy="170" r="28" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.4" />
    <circle cx="100" cy="170" r="18" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.3" />
    <text x="100" y="173" textAnchor="middle" fontSize="14" fill="#FFD700" opacity="0.6" fontFamily="serif">ॐ</text>

    {/* Metal ring bottom */}
    <ellipse cx="100" cy="170" rx="52" ry="14" fill="none" stroke="url(#metalRing)" strokeWidth="4" />

    {/* Rope/string left side - hanging bead rope */}
    {/* Left rope from waist going out */}
    <path d="M 82 125 Q 40 125 30 110" stroke="url(#ropeGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Left bead */}
    <circle cx="30" cy="110" r="7" fill="url(#beadGrad)" filter="url(#glow)" />
    <circle cx="28" cy="108" r="2.5" fill="#FF9966" />

    {/* Right rope from waist going out */}
    <path d="M 118 125 Q 160 125 170 110" stroke="url(#ropeGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Right bead */}
    <circle cx="170" cy="110" r="7" fill="url(#beadGrad)" filter="url(#glow)" />
    <circle cx="168" cy="108" r="2.5" fill="#FF9966" />

    {/* Decorative engravings on drum body */}
    {/* Upper body pattern */}
    <path d="M 65 95 Q 100 105 135 95" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M 60 103 Q 100 115 140 103" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.4" />
    {/* Lower body pattern */}
    <path d="M 65 155 Q 100 145 135 155" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M 60 147 Q 100 135 140 147" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.4" />

    {/* Decorative tassels on handle ends */}
    {/* Top tassel */}
    <circle cx="100" cy="14" r="8" fill="url(#metalRing)" />
    <circle cx="100" cy="14" r="5" fill="#FFD700" />
    {/* Bottom tassel */}
    <circle cx="100" cy="246" r="8" fill="url(#metalRing)" />
    <circle cx="100" cy="246" r="5" fill="#FFD700" />

    {/* Shimmer/sacred glow overlay */}
    <ellipse cx="100" cy="80" rx="20" ry="5" fill="white" opacity="0.15" />
    <ellipse cx="100" cy="170" rx="20" ry="5" fill="white" opacity="0.15" />
  </svg>
);

// Particles: sacred energy dots
const SacredParticles = () => (
  <>
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: i % 3 === 0 ? 6 : 4,
          height: i % 3 === 0 ? 6 : 4,
          background: i % 2 === 0 ? '#FFD700' : '#FF8C00',
          left: `${20 + (i * 5.5) % 60}%`,
          top: `${15 + (i * 7) % 70}%`,
          boxShadow: '0 0 8px #FFD700',
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0, 1, 0],
          scale: [0.5, 1.2, 0.5],
        }}
        transition={{
          duration: 2 + (i * 0.4),
          repeat: Infinity,
          delay: i * 0.25,
          ease: 'easeInOut',
        }}
      />
    ))}
  </>
);

export const AnimatedDamru = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Sacred golden aura glow behind damru */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 340,
          height: 340,
          background: 'radial-gradient(circle, rgba(212,160,23,0.18) 0%, rgba(139,100,20,0.08) 60%, transparent 80%)',
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Outer ring - rotating sacred geometry */}
      <motion.div
        className="absolute"
        style={{ width: 300, height: 300 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full opacity-20">
          {[0, 30, 60, 90, 120, 150].map((angle) => (
            <line
              key={angle}
              x1="150" y1="10" x2="150" y2="290"
              stroke="#FFD700"
              strokeWidth="1"
              transform={`rotate(${angle} 150 150)`}
            />
          ))}
          <circle cx="150" cy="150" r="140" stroke="#FFD700" strokeWidth="1" fill="none" strokeDasharray="4 8" />
          <circle cx="150" cy="150" r="110" stroke="#FFD700" strokeWidth="0.5" fill="none" strokeDasharray="2 6" />
        </svg>
      </motion.div>

      {/* Counter-rotating inner ring */}
      <motion.div
        className="absolute"
        style={{ width: 220, height: 220 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 220 220" className="w-full h-full opacity-15">
          {[0, 45, 90, 135].map((angle) => (
            <line
              key={angle}
              x1="110" y1="5" x2="110" y2="215"
              stroke="#FFA500"
              strokeWidth="1"
              transform={`rotate(${angle} 110 110)`}
            />
          ))}
          <circle cx="110" cy="110" r="100" stroke="#FFA500" strokeWidth="1.5" fill="none" />
        </svg>
      </motion.div>

      {/* The Damru itself - with shake/vibration animation */}
      <motion.div
        style={{ width: 160, height: 210, position: 'relative', zIndex: 10 }}
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        animate={{
          opacity: [0, 1],
          scale: [0.5, 1],
          rotate: [-15, 0],
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        {/* Continuous gentle shake */}
        <motion.div
          className="w-full h-full"
          animate={{
            rotate: [-8, 8, -8],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 1.5,
          }}
        >
          {/* Bead swing animation - left */}
          <motion.div
            className="absolute"
            style={{ left: -20, top: '42%', zIndex: 11 }}
            animate={{
              x: [-18, 2, -18],
              y: [-5, 8, -5],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 1.5,
            }}
          >
          </motion.div>

          <DamruSVG />
        </motion.div>

        {/* Sound wave rings on beat */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-yellow-400"
            style={{
              inset: -ring * 20,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0.8, 1.3, 1.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: ring * 0.25 + 0,
              repeatDelay: 0,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>

      {/* Floating sacred particles */}
      <div className="absolute inset-0">
        <SacredParticles />
      </div>

      {/* Subtle OM text floating */}
      {['ॐ', '꩜', 'ॐ'].map((sym, i) => (
        <motion.span
          key={i}
          className="absolute text-yellow-400 font-serif select-none"
          style={{
            fontSize: i === 1 ? 28 : 18,
            left: i === 0 ? '8%' : i === 1 ? '82%' : '15%',
            top: i === 0 ? '20%' : i === 1 ? '55%' : '75%',
            opacity: 0.25,
            textShadow: '0 0 12px #FFD700',
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        >
          {sym}
        </motion.span>
      ))}
    </div>
  );
};