import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const collections = [
  { name: 'SHIVA', slug: 'Shiva' },
  { name: 'SHROOMS', slug: 'Shrooms' },
  { name: 'ACID', slug: 'ACID' },
  { name: 'CHAKRAS', slug: 'Chakras' },
  { name: 'DARK', slug: 'Dark' },
  { name: 'RICK N MORTY', slug: 'Rick n Morty' },
];

export const BrandMarquee = () => {
  // Duplicate collections multiple times for seamless loop
  const repeatedCollections = [...collections, ...collections, ...collections, ...collections];
  
  return (
    <section className="py-2 md:py-3 bg-card overflow-hidden flex items-center">
      <div className="flex w-full">
        <motion.div
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          {repeatedCollections.map((collection, i) => (
            <div key={`first-${i}`} className="mx-3 md:mx-8 flex items-center justify-center">
              <Link 
                to={`/shop?collection=${collection.slug}`}
                className="font-display text-lg md:text-2xl lg:text-3xl text-muted-foreground/50 dark:text-white/50 hover:text-primary hover:dark:text-primary transition-colors duration-300 cursor-pointer whitespace-nowrap"
              >
                {collection.name}
              </Link>
            </div>
          ))}
          {repeatedCollections.map((collection, i) => (
            <div key={`second-${i}`} className="mx-3 md:mx-8 flex items-center justify-center">
              <Link 
                to={`/shop?collection=${collection.slug}`}
                className="font-display text-lg md:text-2xl lg:text-3xl text-muted-foreground/50 dark:text-white/50 hover:text-primary hover:dark:text-primary transition-colors duration-300 cursor-pointer whitespace-nowrap"
              >
                {collection.name}
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
