import { motion } from 'framer-motion';

const brands = ['NIKE', 'ADIDAS', 'SUPREME', 'OFF-WHITE', 'STÜSSY', 'BAPE', 'PALACE', 'CARHARTT'];

export const BrandMarquee = () => {
  return (
    <section className="py-16 bg-card border-y border-border overflow-hidden">
      <div className="flex">
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="mx-12 flex items-center justify-center"
            >
              <span className="font-display text-4xl md:text-5xl text-muted-foreground/30 hover:text-foreground transition-colors duration-300 cursor-default whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </motion.div>
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="mx-12 flex items-center justify-center"
            >
              <span className="font-display text-4xl md:text-5xl text-muted-foreground/30 hover:text-foreground transition-colors duration-300 cursor-default whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
