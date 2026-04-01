import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const VideoSection = () => {
  return (
    <section className="py-16 pb-12 md:pb-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight mb-6"
          >
            <span className="text-gradient">YOUR ART.</span>
            <br />
            <span className="text-accent-gradient">OUR PLATFORM!</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4 mb-10"
          >
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              We collaborate with underground artists and creators
              <br />
              and turn their work into wearable revolution.
            </p>
            <p className="text-lg md:text-xl text-foreground font-medium">
              If you've got the vision, we've got the platform.
            </p>

            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            <Button
              variant="hero"
              size="lg"
              asChild
              className="text-lg px-8 py-6 group"
            >
              <Link to="/collab">
                JOIN THE MOVEMENT
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// export const VideoSection = () => {
//   const containerRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     setIsMobile(window.innerWidth < 768);
//   }, []);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ['start end', 'end start'],
//   });

//   const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
//   const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
//   const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

//   return (
//     <section ref={containerRef} className="py-0 bg-background overflow-hidden">
//       <motion.div style={{ scale, opacity }} className="relative h-[80vh] lg:h-screen">
//         <motion.div style={{ y: isMobile ? undefined : y }} className="absolute inset-0">
//           <img 
//             src={heroDark} 
//             alt="Campaign" 
//             className="w-full h-[120%] object-cover" 
//             loading="lazy"
//           />
//           <div className="absolute inset-0 bg-background/60" />
//         </motion.div>

//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="text-center">
//             <motion.button
//               initial={{ scale: 0 }}
//               whileInView={{ scale: 1 }}
//               viewport={{ once: true }}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setIsPlaying(!isPlaying)}
//               className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-foreground/30 hover:border-primary hover:bg-primary/10 flex items-center justify-center mb-8 md:mb-12 mx-auto relative group transition-all duration-300"
//             >
//               <Play size={32} className="ml-2 group-hover:text-primary transition-colors md:w-10 md:h-10" />
//             </motion.button>

//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="font-display text-4xl md:text-7xl lg:text-9xl leading-none mb-4 md:mb-6"
//             >
//               <span className="text-gradient">EMBRACE</span>
//               <br />
//               <span className="text-accent-gradient">THE DARK</span>
//             </motion.h2>

//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="text-muted-foreground text-base md:text-xl max-w-md mx-auto px-4"
//             >
//               Watch our latest campaign. See the rebellion in action.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.2 }}
//               className="flex items-center justify-center gap-4 md:gap-6 mt-6 md:mt-10"
//             >
//               <button
//                 onClick={() => setIsMuted(!isMuted)}
//                 className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//                 {isMuted ? 'Unmute' : 'Mute'}
//               </button>
//               <span className="text-border">|</span>
//               <span className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground">2:34 min</span>
//             </motion.div>
//           </div>
//         </div>

//         {!isMobile && (
//           <>
//             <motion.div
//               initial={{ opacity: 0, x: -40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block"
//             >
//               <span className="text-sm uppercase tracking-widest text-muted-foreground vertical-text">
//                 Campaign 2026
//               </span>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: 40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block"
//             >
//               <span className="text-sm uppercase tracking-widest text-muted-foreground vertical-text">
//                 Behind the Ink
//               </span>
//             </motion.div>
//           </>
//         )}
//       </motion.div>
//     </section>
//   );
// };
