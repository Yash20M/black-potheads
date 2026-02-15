import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import skullTee from '@/assets/products/skull-tee.jpg';
import gothicTee from '@/assets/products/gothic-tee.jpg';
import tribalTee from '@/assets/products/tribal-tee.jpg';
import graffitiTee from '@/assets/products/graffiti-tee.jpg';

const categories = [
  { name: 'SKULLS', count: 8, image: skullTee, color: 'from-red-500/20' },
  { name: 'GOTHIC', count: 6, image: gothicTee, color: 'from-purple-500/20' },
  { name: 'TRIBAL', count: 7, image: tribalTee, color: 'from-orange-500/20' },
  { name: 'GRAFFITI', count: 5, image: graffitiTee, color: 'from-pink-500/20' },
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

        <motion.div style={{ x }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="relative h-[400px] overflow-hidden bg-card"
                >
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

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
                      <span className="text-muted-foreground text-sm block mb-2">{category.count} products</span>
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
