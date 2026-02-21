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
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-sm uppercase tracking-widest text-gray-400 mb-4 block">
            Browse By
          </span>
          <h2 className="font-display text-5xl md:text-7xl text-white">CATEGORIES</h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Carousel */}
          <div className="relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] overflow-hidden">
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
              className="absolute inset-0 flex items-center justify-center"
            >
              <Link to={`/shop?collection=${categories[currentIndex].name}`} className="w-full h-full">
                <div className="relative h-full group cursor-pointer">
                  {/* Image */}
                  <motion.img
                    src={categories[currentIndex].image}
                    alt={categories[currentIndex].name}
                    className="w-full h-full object-contain"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  {/* Category Name */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 md:bottom-8 md:left-8 md:right-8">
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-white leading-tight"
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
            className="absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 sm:gap-3">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 sm:w-10 md:w-12 h-1.5 sm:h-2 bg-white'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Preview */}
        <div className="mt-6 sm:mt-8 md:mt-12 max-w-6xl mx-auto grid grid-cols-6 gap-1.5 sm:gap-2 md:gap-4 px-2 sm:px-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              onClick={() => handleDotClick(index)}
              className={`relative h-16 sm:h-20 md:h-24 overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-2 ring-white scale-105'
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
