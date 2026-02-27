import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const collections = [
  { name: 'SHIVA', slug: 'Shiva' },
  { name: 'SHROOMS', slug: 'Shrooms' },
  { name: 'LSD', slug: 'LSD' },
  { name: 'CHAKRAS', slug: 'Chakras' },
  { name: 'DARK', slug: 'Dark' },
  { name: 'RICK N MORTY', slug: 'Rick n Morty' },
];

export const BrandMarquee = () => {
  return (
    <section className="py-2 md:py-3 bg-card border-y border-border overflow-hidden">
      <div className="flex">
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          {[...collections, ...collections].map((collection, i) => (
            <div key={i} className="mx-3 md:mx-8 flex items-center justify-center">
              <Link 
                to={`/shop?collection=${collection.slug}`}
                className="font-display text-lg md:text-2xl lg:text-3xl text-muted-foreground/20 hover:text-primary/60 transition-colors duration-300 cursor-pointer whitespace-nowrap"
              >
                {collection.name}
              </Link>
            </div>
          ))}
        </motion.div>
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          {[...collections, ...collections].map((collection, i) => (
            <div key={i} className="mx-3 md:mx-8 flex items-center justify-center">
              <Link 
                to={`/shop?collection=${collection.slug}`}
                className="font-display text-lg md:text-2xl lg:text-3xl text-muted-foreground/20 hover:text-primary/60 transition-colors duration-300 cursor-pointer whitespace-nowrap"
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
