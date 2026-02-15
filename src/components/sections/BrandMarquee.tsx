import { motion } from 'framer-motion';

const brandWords = ['SKULLS', 'GOTHIC', 'TRIBAL', 'GRAFFITI', 'TATTOO', 'REBELLION', 'DARKNESS', 'CHAOS'];

export const BrandMarquee = () => {
  return (
    <section className="py-16 bg-card border-y border-border overflow-hidden">
      <div className="flex">
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          {[...brandWords, ...brandWords].map((word, i) => (
            <div key={i} className="mx-12 flex items-center justify-center">
              <span className="font-display text-4xl md:text-5xl text-muted-foreground/20 hover:text-primary/60 transition-colors duration-300 cursor-default whitespace-nowrap">
                {word}
              </span>
            </div>
          ))}
        </motion.div>
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          {[...brandWords, ...brandWords].map((word, i) => (
            <div key={i} className="mx-12 flex items-center justify-center">
              <span className="font-display text-4xl md:text-5xl text-muted-foreground/20 hover:text-primary/60 transition-colors duration-300 cursor-default whitespace-nowrap">
                {word}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
