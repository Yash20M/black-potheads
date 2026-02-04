import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-model.jpg';
import collectionBanner from '@/assets/collection-banner.jpg';

export const LookbookSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            style={{ opacity }}
            className="relative z-10"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm uppercase tracking-widest text-primary mb-4 block"
            >
              Lookbook 2025
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-6xl md:text-8xl leading-none mb-6"
            >
              URBAN<br />
              <span className="text-accent-gradient">EXPLORER</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg mb-8 max-w-md"
            >
              Discover our latest collection designed for those who navigate the concrete jungle with style. 
              Each piece tells a story of urban culture and street authenticity.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button variant="hero" size="lg" asChild>
                <Link to="/collections">
                  View Lookbook
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Parallax Images */}
          <div className="relative h-[600px]">
            <motion.div
              style={{ y: y1 }}
              className="absolute top-0 right-0 w-3/4 h-96 overflow-hidden"
            >
              <motion.img
                initial={{ scale: 1.2, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                src={heroImage}
                alt="Lookbook"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              style={{ y: y2 }}
              className="absolute bottom-0 left-0 w-2/3 h-80 overflow-hidden border-4 border-background"
            >
              <motion.img
                initial={{ scale: 1.2, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                src={collectionBanner}
                alt="Lookbook"
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Decorative Element */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary flex items-center justify-center"
            >
              <span className="font-display text-2xl text-primary">25</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
