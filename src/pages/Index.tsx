import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { BrandMarquee } from '@/components/sections/BrandMarquee';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { LookbookSection } from '@/components/sections/LookbookSection';
import { AboutBrandSection } from '@/components/sections/AboutBrandSection';
import { CategoriesShowcase } from '@/components/sections/CategoriesShowcase';
import { TrendingSection } from '@/components/sections/TrendingSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { VideoSection } from '@/components/sections/VideoSection';
import { ScrollingText } from '@/components/sections/ScrollingText';
import { UpcomingDrop } from '@/components/sections/UpcomingDrop';
import { useEffect, useState, useRef } from 'react';
import { productApi } from '@/lib/api';
import { toast } from 'sonner';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const imageRef = useRef<HTMLDivElement>(null);

  // Mouse position tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement with full 360 rotation - slower and smoother
  const springConfig = { damping: 40, stiffness: 80 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [180, -180]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-180, 180]), springConfig);

  // Handle mouse move for 3D rotation - only on image
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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
    <div className="min-h-screen bg-black">
      {/* ===== 3D ROTATING HERO IMAGE ===== */}
      <section 
        className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] w-full overflow-hidden flex items-center justify-center bg-black"
        style={{ perspective: '1000px' }}
      >
        {/* Pure Black Background Layer */}
        <div className="absolute inset-0 bg-black -z-10" />
        
        {/* 3D Rotating Image Container */}
        <motion.div
          ref={imageRef}
          className="relative w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] mx-auto px-4 sm:px-0"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Image with Black Background */}
          <motion.div
            className="relative w-full h-full bg-black"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src="/homeimg.jpeg"
              alt="Black Potheads"
              className="w-full h-full object-cover"
              style={{
                filter: 'brightness(1.2) contrast(1.4) saturate(1.1)',
                mixBlendMode: 'lighten',
              }}
            />
          </motion.div>

          {/* Floating particles effect */}
          <motion.div
            className="absolute -inset-20 pointer-events-none"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Instruction Text */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-white/60 text-sm uppercase tracking-[0.3em]">
            Move your cursor to explore
          </p>
        </motion.div>
      </section>

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

      {/* <section className="py-24 bg-card">
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
      </section> */}

      <UpcomingDrop />
      <StatsSection />
      <TestimonialsSection />
      {/* <NewsletterSection /> */}
    </div>
  );
};


export default Index;
