import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'SHIVA', image: '/Shiva.PNG', slug: 'Shiva' },
  { name: 'SHROOMS', image: '/Shrooms.PNG', slug: 'Shrooms' },
  { name: 'LSD', image: '/LSD.PNG', slug: 'LSD' },
  { name: 'CHAKRAS', image: '/Chakras.PNG', slug: 'Chakras' },
  { name: 'DARK', image: '/Dark.PNG', slug: 'Dark' },
  { name: 'RICK N MORTY', image: '/Rick-N-Morty.PNG', slug: 'Rick n Morty' },
];

// Positions: -1 = left behind, 0 = center front, 1 = right behind
const getCardStyle = (position: number) => {
  switch (position) {
    case 0: // Center — front
      return {
        x: '0%',
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 20,
      };
    case -1: // Left — behind
      return {
        x: '-70%',
        z: -250,
        rotateY: 38,
        scale: 0.80,
        opacity: 0.75,
        zIndex: 10,
      };
    case 1: // Right — behind
      return {
        x: '70%',
        z: -250,
        rotateY: -38,
        scale: 0.80,
        opacity: 0.75,
        zIndex: 10,
      };
    default: // Hidden
      return {
        x: '0%',
        z: -400,
        rotateY: 0,
        scale: 0.5,
        opacity: 0,
        zIndex: 0,
      };
  }
};

export const CategoriesShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const mod = (n: number, m: number) => ((n % m) + m) % m;

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => mod(prev + 1, categories.length));
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => mod(prev - 1, categories.length));
  }, []);

  useEffect(() => {
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [handleNext]);

  // Each card gets a position relative to currentIndex: -1, 0, 1, or hidden
  const getPosition = (index: number): number | null => {
    const diff = mod(index - currentIndex, categories.length);
    if (diff === 0) return 0;                              // center
    if (diff === 1) return 1;                              // right
    if (diff === categories.length - 1) return -1;        // left
    return null;                                           // hidden
  };

  return (
    <section className="w-full py-12 md:py-16 flex flex-col items-center gap-8 bg-black overflow-hidden">
      {/* Header */}
      <div className="text-center">
        <p className="text-white/50 tracking-[0.3em] text-xs uppercase mb-1">Browse By</p>
        <h2 className="text-white text-4xl md:text-5xl font-bold tracking-widest uppercase">
          Categories
        </h2>
      </div>

      {/* 3D Carousel Stage */}
      <div
        className="relative w-full max-w-3xl h-[380px] md:h-[480px] flex items-center justify-center"
        style={{ perspective: '1400px' }}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {categories.map((category, index) => {
            const position = getPosition(index);
            if (position === null) return null;

            const style = getCardStyle(position);
            const isCenter = position === 0;

            return (
              <motion.div
                key={category.slug}
                className="absolute"
                style={{
                  width: '280px',
                  height: '380px',
                  transformStyle: 'preserve-3d',
                  zIndex: style.zIndex,
                  cursor: isCenter ? 'default' : 'pointer',
                }}
                animate={{
                  x: style.x,
                  z: style.z,
                  rotateY: style.rotateY,
                  scale: style.scale,
                  opacity: style.opacity,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.32, 0.72, 0, 1],
                }}
                onClick={() => {
                  if (position === 1) handleNext();
                  if (position === -1) handlePrev();
                }}
              >
                <Link
                  to={`/shop?collection=${category.slug}`}
                  onClick={(e) => !isCenter && e.preventDefault()}
                  className="block w-full h-full rounded-2xl overflow-hidden relative"
                  style={{
                    boxShadow: isCenter
                      ? '0 30px 80px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.85), 0 0 30px rgba(255,255,255,0.15)'
                      : '0 15px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.25)',
                  }}
                >
                  {/* Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Category name */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-xl font-bold tracking-widest uppercase text-center">
                      {category.name}
                    </h3>
                  </div>

                  {/* Active glow border */}
                  {isCenter && (
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-white/60 pointer-events-none" />
                  )}

                  {/* Side card hint arrow */}
                  {!isCenter && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                      <div className="text-white/60 text-3xl">
                        {position === -1 ? '‹' : '›'}
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Arrow navigation */}
      <div className="flex items-center gap-6">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 md:gap-3 px-4">
        {categories.map((category, index) => (
          <motion.button
            key={category.slug}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`relative h-14 w-14 md:h-20 md:w-20 rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 ${
              index === currentIndex
                ? 'ring-2 ring-white scale-105'
                : 'opacity-50 hover:opacity-90'
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </section>
  );
};