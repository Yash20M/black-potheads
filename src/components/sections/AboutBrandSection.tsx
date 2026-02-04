import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const AboutBrandSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section ref={containerRef} className="py-32 bg-secondary overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Animated Images */}
          <div className="relative h-[600px]">
            <motion.div
              style={{ scale: imageScale, rotate: imageRotate }}
              className="absolute top-0 left-0 w-4/5 h-80 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="w-full h-full bg-[url('/placeholder.svg')] bg-cover bg-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
            </motion.div>
            
            <motion.div
              style={{ y: textY }}
              className="absolute bottom-0 right-0 w-3/4 h-72 bg-card border border-border p-8 flex flex-col justify-end"
            >
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '60%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-1 bg-primary mb-6 block"
              />
              <p className="font-display text-4xl">SINCE 2019</p>
              <p className="text-muted-foreground mt-2">Redefining urban fashion</p>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="absolute top-1/2 right-0 w-24 h-24 bg-primary rounded-full flex items-center justify-center"
            >
              <span className="font-display text-3xl text-primary-foreground">★</span>
            </motion.div>
          </div>

          {/* Right - Content */}
          <motion.div style={{ y: textY }}>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm uppercase tracking-widest text-primary mb-4 block"
            >
              Our Story
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-7xl leading-none mb-8"
            >
              MORE THAN<br />
              <span className="text-accent-gradient">JUST CLOTHES</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg mb-6 leading-relaxed"
            >
              Born on the streets of New York, STRTWEAR emerged from a collective 
              vision to bridge high fashion with authentic street culture. Every 
              stitch tells a story of rebellion, creativity, and uncompromising quality.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg mb-8 leading-relaxed"
            >
              We don't follow trends—we set them. Our pieces are designed for 
              individuals who express themselves through what they wear.
            </motion.p>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              {[
                { number: '50K+', label: 'Community' },
                { number: '200+', label: 'Drops' },
                { number: '100%', label: 'Authentic' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <p className="font-display text-3xl text-primary">{stat.number}</p>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
