import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import collectionBanner from '@/assets/collection-dark.jpg';
import { BrandMarquee } from '@/components/sections/BrandMarquee';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { InstagramSection } from '@/components/sections/InstagramSection';
import { LookbookSection } from '@/components/sections/LookbookSection';
import { AboutBrandSection } from '@/components/sections/AboutBrandSection';
import { CategoriesShowcase } from '@/components/sections/CategoriesShowcase';
import { TrendingSection } from '@/components/sections/TrendingSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { VideoSection } from '@/components/sections/VideoSection';
import { ScrollingText } from '@/components/sections/ScrollingText';
import { UpcomingDrop } from '@/components/sections/UpcomingDrop';
import { useRef, useEffect, useState, useCallback } from 'react';
import { productApi } from '@/lib/api';
import { toast } from 'sonner';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  // Scroll-linked video: track scroll over the hero container (3x viewport tall)
  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end start'],
  });

  // Tie video currentTime to scroll position
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const video = videoRef.current;
    if (video && video.duration && isFinite(video.duration)) {
      video.currentTime = latest * video.duration;
    }
  });

  // Hero content opacity/transforms based on scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '-20%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.85]);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data: any = await productApi.getFeatured(3);
      const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
      setFeaturedProducts(normalized);
    } catch (error: any) {
      toast.error('Failed to load featured products');
      console.error('Featured products error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ===== STICKY VIDEO HERO ===== */}
      {/* This container is 300vh tall so the video stays pinned while user scrolls */}
      <div ref={heroContainerRef} className="relative" style={{ height: '300vh' }}>
        {/* Sticky video layer */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/Video.mp4" type="video/mp4" />
          </video>
          {/* Dynamic dark overlay that increases with scroll */}
          <motion.div
            className="absolute inset-0 bg-background"
            style={{ opacity: overlayOpacity }}
          />

          {/* Hero content — fades out as you scroll */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <div className="text-center px-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-display text-7xl md:text-9xl lg:text-[12rem] leading-none tracking-tight">
                  BLACK
                  <br />
                  <span className="text-gradient">POTHEADS</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-muted-foreground text-lg md:text-xl mt-6 max-w-lg mx-auto"
              >
                Premium streetwear for the bold. Not for the faint-hearted.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-10"
              >
                <Button variant="hero" size="lg" asChild>
                  <Link to="/shop">
                    Shop Now
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-16"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2 mx-auto"
                >
                  <motion.div className="w-1 h-2 bg-foreground/40 rounded-full" />
                </motion.div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground mt-3 block">
                  Scroll to explore
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== MARQUEE BAR ===== */}
      <div className="bg-background/90 backdrop-blur-sm py-3 overflow-hidden border-b border-border/30">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="mx-8 font-display text-lg tracking-wider text-muted-foreground">
              FREE SHIPPING ON ORDERS OVER $100 ✦ NEW DROPS EVERY FRIDAY ✦ BLACK POTHEADS ✦
            </span>
          ))}
        </div>
      </div>

      {/* Brand Marquee */}
      <BrandMarquee />

      {/* Categories Showcase */}
      <CategoriesShowcase />

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 60 }}
                viewport={{ once: true }}
                className="h-1 bg-primary mb-6"
              />
              <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
                Just Dropped
              </span>
              <h2 className="font-display text-5xl md:text-6xl">NEW ARRIVALS</h2>
            </div>
            <Button variant="minimal" asChild>
              <Link to="/shop">
                View All Products
                <ArrowRight size={18} />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Loading featured products...
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No featured products available
              </div>
            ) : (
              featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Scrolling Text */}
      <ScrollingText />

      {/* Trending Products */}
      <TrendingSection />

      {/* Video / Campaign Section */}
      <VideoSection />

      {/* About Brand Section */}
      <AboutBrandSection />

      {/* Lookbook Section */}
      <LookbookSection />

      {/* Process Section */}
      <ProcessSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Collection Banner */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] overflow-hidden group cursor-pointer"
          >
            <Link to="/collections">
              <motion.img
                src={collectionBanner}
                alt="Dark Collection"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-primary text-sm uppercase tracking-widest mb-4 block"
                  >
                    Featured Collection
                  </motion.span>
                  <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-display text-5xl md:text-7xl mb-4"
                  >
                    DARK EDITION 2026
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-lg mb-6 max-w-md"
                  >
                    12 exclusive printed tees. Limited run. Once gone, gone forever.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button variant="hero" size="lg">
                      Explore Collection
                      <ArrowRight size={18} />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Drop */}
      <UpcomingDrop />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Instagram Feed */}
      <InstagramSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
};

export default Index;
