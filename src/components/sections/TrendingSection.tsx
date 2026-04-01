import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { videoApi } from '@/lib/api';

interface FeaturedVideo {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface VideoApiResponse {
  success: boolean;
  video?: FeaturedVideo;
}

export const TrendingSection = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [featuredVideo, setFeaturedVideo] = useState<FeaturedVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVideo();
  }, []);

  const fetchFeaturedVideo = async () => {
    try {
      const data = await videoApi.getFeatured() as VideoApiResponse;
      
      if (data.success && data.video) {
        setFeaturedVideo(data.video);
      }
    } catch (error) {
      console.error('Error fetching featured video:', error);
    } finally {
      setLoading(false);
    }
  };

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
      {loading ? (
        <div className="relative w-full h-screen flex items-center justify-center bg-muted">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : featuredVideo ? (
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
          {/* Video Container - Full Screen */}
          <div className="relative w-full h-screen overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loop
              muted
              playsInline
              autoPlay
            >
              <source src={featuredVideo.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Overlay on hover - Desktop only */}
            <motion.div
              className="hidden md:flex absolute inset-0 bg-black/30 items-center justify-center"
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
                  {featuredVideo.title || 'EXPLORE COLLECTION'}
                </p>
                <p className="text-white/80 text-sm md:text-base uppercase tracking-widest">
                  {featuredVideo.description || 'Click to shop now'}
                </p>
              </motion.div>
            </motion.div>

            {/* Permanent text overlay - Mobile only */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm p-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <p className="text-white text-xl font-display mb-1.5 drop-shadow-lg">
                  {featuredVideo.title || 'EXPLORE COLLECTION'}
                </p>
                <p className="text-white/90 text-xs uppercase tracking-widest drop-shadow-md">
                  {featuredVideo.description || 'Tap to shop now'}
                </p>
              </motion.div>
            </div>

            {/* Border animation on hover */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
          </div>
        </motion.div>
      ) : (
        // Fallback to default video if no featured video is available
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
          {/* Video Container - Full Screen */}
          <div className="relative w-full h-screen overflow-hidden">
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

            {/* Overlay on hover - Desktop only */}
            <motion.div
              className="hidden md:flex absolute inset-0 bg-black/30 items-center justify-center"
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

            {/* Permanent text overlay - Mobile only */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm p-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <p className="text-white text-xl font-display mb-1.5 drop-shadow-lg">
                  EXPLORE COLLECTION
                </p>
                <p className="text-white/90 text-xs uppercase tracking-widest drop-shadow-md">
                  Tap to shop now
                </p>
              </motion.div>
            </div>

            {/* Border animation on hover */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
          </div>
        </motion.div>
      )}
    </section>
  );
};
