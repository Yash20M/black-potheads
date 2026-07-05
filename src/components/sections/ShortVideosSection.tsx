import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VIDEOS = [
  { id: 1, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 01' },
  { id: 2, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 02' },
  { id: 3, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 03' },
  { id: 4, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 04' },
  { id: 5, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 05' },
];

// Responsive sizes
const getSizes = (isFeatured: boolean, isDesktop: boolean) => {
  if (isDesktop) {
    return isFeatured
      ? { width: 270, height: 440 }
      : { width: 175, height: 285 };
  }
  return isFeatured
    ? { width: 190, height: 320 }
    : { width: 120, height: 200 };
};

const VideoCard = ({
  video,
  isFeatured,
  globalMuted,
  isDesktop,
  onToggleMute,
  onClick,
}: {
  video: (typeof VIDEOS)[0];
  isFeatured: boolean;
  globalMuted: boolean;
  isDesktop: boolean;
  onToggleMute: () => void;
  onClick: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sizes = getSizes(isFeatured, isDesktop);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = globalMuted;
  }, [globalMuted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      layout
      onClick={onClick}
      animate={{ width: sizes.width, height: sizes.height, opacity: isFeatured ? 1 : 0.72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex-shrink-0 rounded-2xl overflow-hidden bg-black cursor-pointer shadow-lg"
      style={{ zIndex: isFeatured ? 10 : 1 }}
    >
      <video
        ref={videoRef}
        src={video.src}
        loop
        muted={globalMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      <AnimatePresence>
        {isFeatured && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            {globalMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const ShortVideosSection = () => {
  const [muted, setMuted] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(Math.floor(VIDEOS.length / 2));
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Detect desktop
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-scroll featured card to center when selected
  useEffect(() => {
    const container = scrollRef.current;
    const card = cardRefs.current[featuredIndex];
    if (!container || !card) return;

    const containerWidth = container.offsetWidth;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const scrollTo = cardLeft - containerWidth / 2 + cardWidth / 2;

    container.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }, [featuredIndex]);

  return (
    <section className="py-12 sm:py-16 bg-background dark:bg-black overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl mb-8 sm:mb-10 text-foreground dark:text-white uppercase tracking-wider"
        >
          See It In Action
        </motion.h2>

        <div
          ref={scrollRef}
          className="flex items-center gap-3 sm:gap-5 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollSnapType: 'x mandatory', paddingLeft: '20%', paddingRight: '20%' }}
        >
          {VIDEOS.map((video, index) => (
            <div
              key={video.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              style={{ scrollSnapAlign: 'center', flexShrink: 0 }}
            >
              <VideoCard
                video={video}
                isFeatured={index === featuredIndex}
                globalMuted={muted}
                isDesktop={isDesktop}
                onToggleMute={() => setMuted((m) => !m)}
                onClick={() => setFeaturedIndex(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
