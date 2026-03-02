import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

export const TrendingSection = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate('/shop');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section className="w-full bg-background overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Video Container - Full Width */}
        <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[85vh] overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loop
            muted
            playsInline
            autoPlay
          >
            <source src="/0_Business_Meeting_Presentation_3840x2160.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-black/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="text-white text-2xl md:text-4xl font-display mb-2">
                EXPLORE COLLECTION
              </p>
              <p className="text-white/80 text-sm md:text-base uppercase tracking-widest">
                Click to shop now
              </p>
            </motion.div>
          </motion.div>

          {/* Border animation on hover */}
          <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
};
