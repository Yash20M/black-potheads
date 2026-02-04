import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import heroImage from '@/assets/hero-model.jpg';

export const VideoSection = () => {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);

  return (
    <section ref={containerRef} className="py-0 bg-background overflow-hidden">
      <motion.div
        style={{ scale, opacity }}
        className="relative h-[80vh] lg:h-screen"
      >
        {/* Video/Image Background with Parallax */}
        <motion.div style={{ y }} className="absolute inset-0">
          <img
            src={heroImage}
            alt="Lifestyle"
            className="w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-background/60" />
        </motion.div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Play Button */}
            <motion.button
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-32 h-32 rounded-full border-2 border-foreground/30 hover:border-primary hover:bg-primary/10 flex items-center justify-center mb-12 mx-auto relative group transition-all duration-300"
            >
              {/* Pulse Ring */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-primary"
              />
              <Play size={40} className="ml-2 group-hover:text-primary transition-colors" />
            </motion.button>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-5xl md:text-8xl lg:text-9xl leading-none mb-6"
            >
              <span className="text-gradient">EXPERIENCE</span>
              <br />
              <span className="text-accent-gradient">THE CULTURE</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto"
            >
              Watch our latest campaign film. See how our community defines style.
            </motion.p>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-6 mt-10"
            >
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <span className="text-border">|</span>
              <span className="text-sm uppercase tracking-wider text-muted-foreground">
                2:34 min
              </span>
            </motion.div>
          </div>
        </div>

        {/* Side Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground vertical-text">
            Campaign 2025
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground vertical-text">
            Behind the Scenes
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};
