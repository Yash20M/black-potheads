import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'SHIVA', image: '/Shiva.PNG', path: '/shop?collection=Shiva' },
  { name: 'SHROOMS', image: '/Shrooms.PNG', path: '/shop?collection=Shrooms' },
  { name: 'LSD', image: '/LSD.PNG', path: '/shop?collection=LSD' },
  { name: 'CHAKRAS', image: '/Chakras.PNG', path: '/shop?collection=Chakras' },
  { name: 'DARK', image: '/Dark.PNG', path: '/shop?collection=Dark' },
  { name: 'RICK N MORTY', image: '/Rick-N-Morty.PNG', path: '/shop?collection=Rick n Morty' },
];

export const ScrollingText = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="space-y-8">
        {/* First Row - Text Only - Left to Right */}
        <div className="relative flex overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{
              x: ['0%', '-50%'],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex">
                {categories.map((category, index) => (
                  <Link
                    key={`${setIndex}-${index}`}
                    to={category.path}
                    className="group inline-block mx-8"
                  >
                    <span className="font-display text-[12vw] text-foreground/50 group-hover:text-foreground/80 transition-colors duration-300">
                      {category.name} •
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second Row - Images with Text - Right to Left */}
        <div className="relative flex overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap items-center"
            animate={{
              x: ['-50%', '0%'],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center">
                {categories.map((category, index) => (
                  <Link
                    key={`${setIndex}-${index}`}
                    to={category.path}
                    className="group inline-flex items-center gap-6 mx-8"
                  >
                    <motion.div
                      className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200x200?text=' + category.name;
                        }}
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                    </motion.div>
                    <span className="font-display text-[8vw] sm:text-[10vw] md:text-[12vw] text-primary/50 group-hover:text-primary/80 transition-colors duration-300">
                      {category.name} •
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
