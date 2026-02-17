import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
import { useRef, useEffect, useState } from 'react';
import { productApi } from '@/lib/api';
import { toast } from 'sonner';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const smoothTimeRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end end'],
  });

  // Preload entire video and track buffering
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force full preload
    video.preload = 'auto';

    const checkBuffered = () => {
      if (video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const pct = Math.min((bufferedEnd / video.duration) * 100, 100);
        setLoadProgress(pct);
        if (bufferedEnd >= video.duration - 0.5) {
          setVideoReady(true);
        }
      }
    };

    const onCanPlayThrough = () => {
      setLoadProgress(100);
      setVideoReady(true);
    };

    video.addEventListener('progress', checkBuffered);
    video.addEventListener('canplaythrough', onCanPlayThrough);
    // Also check periodically in case events are missed
    const interval = setInterval(checkBuffered, 200);

    // Trigger load
    video.load();

    return () => {
      video.removeEventListener('progress', checkBuffered);
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      clearInterval(interval);
    };
  }, []);

  // Smooth video scrubbing with interpolation (lerp)
  useEffect(() => {
    if (!videoReady) return;
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const duration = video.duration;
    smoothTimeRef.current = 0;

    const tick = () => {
      const targetTime = scrollYProgress.get() * duration;
      // Lerp for buttery smoothness — interpolate 12% toward target each frame
      smoothTimeRef.current += (targetTime - smoothTimeRef.current) * 0.12;

      // Clamp
      const clamped = Math.max(0, Math.min(smoothTimeRef.current, duration));
      video.currentTime = clamped;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [videoReady, scrollYProgress]);

  // Hero text appears after scrolling ~15%
  const textOpacity = useTransform(scrollYProgress, [0.12, 0.22, 0.42, 0.55], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.12, 0.22, 0.42, 0.55], [80, 0, 0, -60]);
  const textScale = useTransform(scrollYProgress, [0.12, 0.22, 0.42, 0.55], [0.9, 1, 1, 0.95]);
  const taglineOpacity = useTransform(scrollYProgress, [0.18, 0.28, 0.42, 0.52], [0, 1, 1, 0]);
  const taglineY = useTransform(scrollYProgress, [0.18, 0.28], [40, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.24, 0.32, 0.42, 0.50], [0, 1, 1, 0]);
  const ctaY = useTransform(scrollYProgress, [0.24, 0.32], [30, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.15, 0.35, 0.65, 0.9]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.9]);

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
      {/* ===== LOADER OVERLAY ===== */}
      <AnimatePresence>
        {!videoReady && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
          >
            {/* Skull pulse */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-10"
            >
              <span className="font-display text-5xl md:text-7xl tracking-tight text-foreground">
                BLACK <span className="text-gradient">POTHEADS</span>
              </span>
            </motion.div>

            {/* Progress bar */}
            <div className="w-48 h-[2px] bg-border/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-foreground/60 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.3, ease: 'linear' }}
              />
            </div>

            <motion.span
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mt-4"
            >
              Loading experience
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SCROLL-LINKED VIDEO HERO ===== */}
      <div ref={heroContainerRef} className="relative" style={{ height: '400vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/Video.mp4" type="video/mp4" />
          </video>

          {/* Cinematic vignette */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: vignetteOpacity }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
          </motion.div>

          {/* Dynamic darkness */}
          <motion.div
            className="absolute inset-0 bg-background pointer-events-none"
            style={{ opacity: overlayOpacity }}
          />

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-9 border border-foreground/30 rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-0.5 h-1.5 bg-foreground/50 rounded-full" />
            </motion.div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/30 mt-3">
              Scroll
            </span>
          </motion.div>

          {/* Hero text — scroll-revealed */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-6 max-w-5xl">
              <motion.div style={{ opacity: textOpacity, y: textY, scale: textScale }}>
                <h1 className="font-display text-[5rem] md:text-[9rem] lg:text-[13rem] leading-[0.85] tracking-tight">
                  <span className="block text-foreground">BLACK</span>
                  <span className="block text-gradient">POTHEADS</span>
                </h1>
              </motion.div>

              <motion.p
                className="text-muted-foreground text-base md:text-lg lg:text-xl mt-8 max-w-md mx-auto font-light tracking-wide"
                style={{ opacity: taglineOpacity, y: taglineY }}
              >
                Premium streetwear for the bold. Not for the faint-hearted.
              </motion.p>

              <motion.div className="mt-10" style={{ opacity: ctaOpacity, y: ctaY }}>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/shop" className="group">
                    Shop Now
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Side labels */}
          <motion.div
            className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:block z-10"
            style={{ opacity: textOpacity }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/20 vertical-text">
              Scroll to explore
            </span>
          </motion.div>
          <motion.div
            className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block z-10"
            style={{ opacity: textOpacity }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/20 vertical-text">
              Est. 2024
            </span>
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <div className="bg-background/90 backdrop-blur-sm py-3 overflow-hidden border-b border-border/30">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="mx-8 font-display text-lg tracking-wider text-muted-foreground">
              FREE SHIPPING ON ORDERS OVER $100 ✦ NEW DROPS EVERY FRIDAY ✦ BLACK POTHEADS ✦
            </span>
          ))}
        </div>
      </div>

      <BrandMarquee />
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
              <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">Just Dropped</span>
              <h2 className="font-display text-5xl md:text-6xl">NEW ARRIVALS</h2>
            </div>
            <Button variant="minimal" asChild>
              <Link to="/shop">View All Products <ArrowRight size={18} /></Link>
            </Button>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading featured products...</div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">No featured products available</div>
            ) : (
              featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      <ScrollingText />
      <TrendingSection />
      <VideoSection />
      <AboutBrandSection />
      <LookbookSection />
      <ProcessSection />
      <FeaturesSection />

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] overflow-hidden group cursor-pointer"
          >
            <Link to="/collections">
              <motion.img src={collectionBanner} alt="Dark Collection" className="w-full h-full object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }} />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6">
                  <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-primary text-sm uppercase tracking-widest mb-4 block">Featured Collection</motion.span>
                  <motion.h3 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display text-5xl md:text-7xl mb-4">DARK EDITION 2026</motion.h3>
                  <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-muted-foreground text-lg mb-6 max-w-md">12 exclusive printed tees. Limited run. Once gone, gone forever.</motion.p>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                    <Button variant="hero" size="lg">Explore Collection <ArrowRight size={18} /></Button>
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      <UpcomingDrop />
      <StatsSection />
      <TestimonialsSection />
      <InstagramSection />
      <NewsletterSection />
    </div>
  );
};

export default Index;
