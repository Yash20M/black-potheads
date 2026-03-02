import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          <div className="relative h-[600px]">
            <motion.div
              style={{ scale: imageScale, rotate: imageRotate }}
              className="absolute top-0 left-0 w-4/5 h-80 bg-black border border-gray-800 overflow-hidden flex items-center justify-center"
            >
              <motion.img 
                src="/logo.png" 
                alt="Black Potheads Logo"
                className="w-32 h-32 md:w-40 md:h-40 object-contain opacity-80"
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                whileInView={{ opacity: 0.8, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
            
            <motion.div
              style={{ y: textY }}
              className="absolute bottom-0 right-0 w-3/4 h-72 bg-black border border-gray-800 p-8 flex flex-col justify-between"
            >
              {/* Logo at top */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center"
              >
                <img 
                  src="/logo.png" 
                  alt="Black Potheads Logo" 
                  className="w-20 h-20 object-contain"
                />
              </motion.div>

              {/* Text at bottom */}
              <div>
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: '60%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-1 bg-white mb-6 block"
                />
                <p className="font-display text-4xl text-white">SINCE 2020</p>
                <p className="text-gray-400 mt-2">Underground. Unapologetic.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="absolute top-1/2 right-0 w-24 h-24 bg-primary rounded-full flex items-center justify-center"
            >
              <span className="font-display text-3xl text-primary-foreground">☠</span>
            </motion.div>
          </div>

          <motion.div style={{ y: textY }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <motion.span
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.3em] text-primary block font-bold relative inline-block"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {'OUR STORY'.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.05,
                    }}
                    className="inline-block hover:scale-110 transition-transform"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </motion.span>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-primary mt-4"
              />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-6xl md:text-8xl lg:text-9xl leading-none mb-8"
            >
              NOT JUST<br />
              <span className="text-accent-gradient">A T-SHIRT</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-xl md:text-2xl mb-6 leading-relaxed"
            >
              Black Potheads was born from the underground — a rebellion against 
              generic streetwear. Every print is a collaboration with tattoo artists, 
              graffiti writers, and dark illustrators.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-xl md:text-2xl mb-8 leading-relaxed"
            >
              We don't follow trends—we burn them. Our tees are statements, 
              worn by those who refuse to blend in.
            </motion.p>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border mb-8">
              {[
                { number: '25K+', label: 'Community' },
                { number: '100+', label: 'Designs' },
                { number: '100%', label: 'Premium' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <p className="font-display text-4xl md:text-5xl text-primary">{stat.number}</p>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Explore Story Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                variant="default" 
                size="lg" 
                asChild
                className="group"
              >
                <Link to="/about" className="flex items-center gap-2">
                  Explore Story
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
