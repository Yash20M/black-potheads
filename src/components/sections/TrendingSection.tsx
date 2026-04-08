import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
          className="relative group"
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

            {/* Collaborate Section */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
              {/* Title Text */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white text-xl md:text-2xl font-bold uppercase tracking-wider text-center px-4"
                style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}
              >
                Rakt Pipasu Records X Black Potheads
              </motion.h3>
              
              {/* Button */}
              <motion.button
                onClick={() => navigate('/collab')}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-gray-100 transition-colors duration-300"
              >
                Collaborate
              </motion.button>
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
          className="relative group"
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

            {/* Collaborate Section */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
              {/* Title Text */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white text-xl md:text-2xl font-bold uppercase tracking-wider text-center px-4"
                style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}
              >
                Rakt Pipasu Records X Black Potheads
              </motion.h3>
              
              {/* Button */}
              <motion.button
                onClick={() => navigate('/collab')}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-gray-100 transition-colors duration-300"
              >
                Collaborate
              </motion.button>
            </div>

            {/* Border animation on hover */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
          </div>
        </motion.div>
      )}
    </section>
  );
};
