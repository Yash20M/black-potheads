import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { videoApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

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
    navigate('/collab');
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

            {/* Text Overlay at Bottom - All Devices */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm py-8 md:py-12 px-4 md:px-6">
              <div className="container mx-auto max-w-4xl text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight mb-3 md:mb-4 text-white drop-shadow-lg"
                >
                  <span className="text-white">YOUR ART.</span>
                  <br />
                  <span className="text-primary">OUR PLATFORM!</span>
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2 md:space-y-3 mb-4 md:mb-6"
                >
                  <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed drop-shadow-md px-2">
                    We collaborate with underground artists and creators
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    and turn their work into wearable revolution.
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-white font-medium drop-shadow-md">
                    If you've got the vision, we've got the platform.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={handleClick}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Join the Movement
                  </Button>
                </motion.div>
              </div>
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

            {/* Text Overlay at Bottom - All Devices */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm py-8 md:py-12 px-4 md:px-6">
              <div className="container mx-auto max-w-4xl text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight mb-3 md:mb-4 text-white drop-shadow-lg"
                >
                  <span className="text-white">YOUR ART.</span>
                  <br />
                  <span className="text-primary">OUR PLATFORM!</span>
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2 md:space-y-3 mb-4 md:mb-6"
                >
                  <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed drop-shadow-md px-2">
                    We collaborate with underground artists and creators
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    and turn their work into wearable revolution.
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-white font-medium drop-shadow-md">
                    If you've got the vision, we've got the platform.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={handleClick}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Join the Movement
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Border animation on hover */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
          </div>
        </motion.div>
      )}
    </section>
  );
};
