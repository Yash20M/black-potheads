import { motion, useScroll, useTransform } from 'framer-motion';
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
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(-1);

  // Scroll progress over the tall hero container
  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth video scrubbing with requestAnimationFrame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Wait for video metadata to be ready
    const onLoaded = () => {
      const tick = () => {
        const progress = scrollYProgress.get();
        const duration = video.duration;
        if (duration && isFinite(duration)) {
          const targetTime = progress * duration;
          // Only update if time changed meaningfully (avoid jitter)
          if (Math.abs(targetTime - lastTimeRef.current) > 0.01) {
            video.currentTime = targetTime;
            lastTimeRef.current = targetTime;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (video.readyState >= 1) {
      onLoaded();
    } else {
      video.addEventListener('loadedmetadata', onLoaded);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [scrollYProgress]);

  // Text appears between 15%-40% scroll, initially hidden
  const textOpacity = useTransform(scrollYProgress, [0.12, 0.22, 0.42, 0.55], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.12, 0.22, 0.42, 0.55], [80, 0, 0, -60]);
  const textScale = useTransform(scrollYProgress, [0.12, 0.22, 0.42, 0.55], [0.9, 1, 1, 0.95]);

  // Subtle tagline arrives slightly after heading
  const taglineOpacity = useTransform(scrollYProgress, [0.18, 0.28, 0.42, 0.52], [0, 1, 1, 0]);
  const taglineY = useTransform(scrollYProgress, [0.18, 0.28], [40, 0]);

  // CTA button
  const ctaOpacity = useTransform(scrollYProgress, [0.24, 0.32, 0.42, 0.50], [0, 1, 1, 0]);
  const ctaY = useTransform(scrollYProgress, [0.24, 0.32], [30, 0]);

  // Overlay darkens as you scroll further
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.15, 0.35, 0.65, 0.9]);

  // Scroll indicator visible only at the very start
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // Vignette / cinematic bars
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
      {/* ===== SCROLL-LINKED VIDEO HERO ===== */}
      <div ref={heroContainerRef} className="relative" style={{ height: '400vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Video */}
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover will-change-auto"
            style={{ willChange: 'auto' }}
          >
            <source src="/Video.mp4" type="video/mp4" />
          </video>

          {/* Cinematic vignette overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: vignetteOpacity }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
          </motion.div>

          {/* Dynamic darkness overlay */}
          <motion.div
            className="absolute inset-0 bg-background pointer-events-none"
            style={{ opacity: overlayOpacity }}
          />

          {/* Scroll indicator — visible initially, fades fast */}
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

          {/* Hero text content — appears after scrolling ~15% */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-6 max-w-5xl">
              {/* Main heading */}
              <motion.div style={{ opacity: textOpacity, y: textY, scale: textScale }}>
                <h1 className="font-display text-[5rem] md:text-[9rem] lg:text-[13rem] leading-[0.85] tracking-tight">
                  <span className="block text-foreground">BLACK</span>
                  <span className="block text-gradient">POTHEADS</span>
                </h1>
              </motion.div>

              {/* Tagline */}
              <motion.p
                className="text-muted-foreground text-base md:text-lg lg:text-xl mt-8 max-w-md mx-auto font-light tracking-wide"
                style={{ opacity: taglineOpacity, y: taglineY }}
              >
                Premium streetwear for the bold. Not for the faint-hearted.
              </motion.p>

              {/* CTA */}
              <motion.div
                className="mt-10"
                style={{ opacity: ctaOpacity, y: ctaY }}
              >
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

      <ScrollingText />
      <TrendingSection />
      <VideoSection />
      <AboutBrandSection />
      <LookbookSection />
      <ProcessSection />
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

      <UpcomingDrop />
      <StatsSection />
      <TestimonialsSection />
      <InstagramSection />
      <NewsletterSection />
    </div>
  );
};

export default Index;
