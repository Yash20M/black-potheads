import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Placeholder videos — replace src with real client videos later ────────────
const VIDEOS = [
  { id: 1, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 01' },
  { id: 2, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 02' },
  { id: 3, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 03' },
  { id: 4, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 04' },
  { id: 5, src: 'https://www.w3schools.com/html/mov_bbb.mp4', label: 'Style 05' },
];

// ── Single video card ─────────────────────────────────────────────────────────
const VideoCard = ({
  video,
  isFeatured,
  globalMuted,
  onToggleMute,
  onClick,
}: {
  video: (typeof VIDEOS)[0];
  isFeatured: boolean;
  globalMuted: boolean;
  onToggleMute: () => void;
  onClick: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      animate={{
        width: isFeatured ? 220 : 140,
        height: isFeatured ? 380 : 240,
        opacity: isFeatured ? 1 : 0.75,
        scale: isFeatured ? 1 : 0.95,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex-shrink-0 rounded-2xl overflow-hidden bg-black cursor-pointer shadow-lg hover:opacity-100 transition-opacity"
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Volume button — only on featured */}
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

// ── ShortVideosSection ────────────────────────────────────────────────────────
export const ShortVideosSection = () => {
  const [muted, setMuted] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(Math.floor(VIDEOS.length / 2));

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

        <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2">
          {VIDEOS.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              isFeatured={index === featuredIndex}
              globalMuted={muted}
              onToggleMute={() => setMuted((m) => !m)}
              onClick={() => setFeaturedIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
