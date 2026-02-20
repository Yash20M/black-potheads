import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  { name: 'SHIVA', image: '/Shiva.PNG', color: 'from-gray-800/20' },
  { name: 'SHROOMS', image: '/Shrooms.PNG', color: 'from-gray-700/20' },
  { name: 'LSD', image: '/LSD.PNG', color: 'from-gray-500/20' },
  { name: 'CHAKRAS', image: '/Chakras.PNG', color: 'from-gray-600/20' },
  { name: 'DARK', image: '/Dark.PNG', color: 'from-gray-700/20' },
  { name: 'RICK N MORTY', image: '/Rick-N-Morty.PNG', color: 'from-gray-600/20' },
];

export const CategoriesShowcase = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section ref={containerRef} className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            Browse By
          </span>
          <h2 className="font-display text-5xl md:text-7xl">CATEGORIES</h2>
        </motion.div>

        <motion.div style={{ x }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 60, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group"
            >
              <Link to="/shop" className="block">
                <motion.div
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="relative h-[400px] overflow-hidden"
                >
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <motion.div className="self-end">
                      <motion.div
                        whileHover={{ rotate: 45, scale: 1.2 }}
                        className="w-12 h-12 border border-foreground/30 group-hover:border-primary group-hover:bg-primary flex items-center justify-center transition-all duration-300"
                      >
                        <ArrowUpRight size={20} className="group-hover:text-primary-foreground" />
                      </motion.div>
                    </motion.div>
                    <div>
                      <h3 className="font-display text-4xl group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  <motion.div className="absolute inset-0 border-2 border-transparent group-hover:border-primary pointer-events-none" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
