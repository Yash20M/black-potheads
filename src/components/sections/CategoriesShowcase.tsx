import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const categories = [
  { name: 'SHIVA', image: '/Shiva.PNG' },
  { name: 'SHROOMS', image: '/Shrooms.PNG' },
  { name: 'LSD', image: '/LSD.PNG' },
  { name: 'CHAKRAS', image: '/Chakras.PNG' },
  { name: 'DARK', image: '/Dark.PNG' },
  { name: 'RICK N MORTY', image: '/Rick-N-Morty.PNG' },
];

export const CategoriesShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play carousel every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <section className="py-20 md:py-32 bg-black overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 mb-2 sm:mb-4 block">
            Browse By
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl text-white">CATEGORIES</h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Carousel */}
          <div className="relative h-[280px] xs:h-[300px] sm:h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden mb-12 sm:mb-16 md:mb-20">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
              }}
              className="absolute inset-0 flex items-start justify-center pt-2 sm:pt-4"
            >
              <Link to={`/shop?collection=${categories[currentIndex].name}`} className="w-full h-full px-12 sm:px-16 md:px-4">
                <div className="relative h-full group cursor-pointer">
                  {/* Image */}
                  <motion.img
                    src={categories[currentIndex].image}
                    alt={categories[currentIndex].name}
                    className="w-full h-full object-contain object-top"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  {/* Category Name */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 md:bottom-6 md:left-6 md:right-6">
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight"
                    >
                      {categories[currentIndex].name}
                    </motion.h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:left-2 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 sm:right-2 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <ChevronRight size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute -bottom-8 sm:-bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2 md:gap-3">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-6 sm:w-8 md:w-10 lg:w-12 h-1 sm:h-1.5 md:h-2 bg-white'
                    : 'w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Preview */}
        <div className="mt-12 sm:mt-16 md:mt-20 max-w-6xl mx-auto grid grid-cols-6 gap-1 sm:gap-1.5 md:gap-2 lg:gap-4 px-0 sm:px-2 md:px-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              onClick={() => handleDotClick(index)}
              className={`relative h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-1 sm:ring-2 ring-white scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
