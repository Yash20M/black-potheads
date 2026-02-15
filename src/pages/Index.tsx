import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Skull } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-dark.jpg';
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
  const heroRef = useRef(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

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
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0"
        >
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            src={heroImage}
            alt="Black Potheads"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, y: textY }} className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Skull size={24} className="text-primary" />
              </motion.div>
              <span className="text-sm uppercase tracking-widest text-muted-foreground">
                Premium Printed Streetwear
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-6"
            >
              <span className="text-gradient">BLACK</span>
              <br />
              <span className="text-accent-gradient">POTHEADS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg md:text-xl text-muted-foreground max-w-md mb-8"
            >
              Wear the rebellion. Premium printed tees for the unapologetically bold.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/shop">
                  Shop Now
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/collections">View Collections</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2 bg-muted-foreground rounded-full" />
          </motion.div>
        </motion.div>

        {/* Marquee */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary py-3 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex">
            {Array(10).fill(null).map((_, i) => (
              <span key={i} className="mx-8 text-primary-foreground font-display text-lg tracking-wider">
                FREE SHIPPING ON ORDERS OVER $100 ✦ NEW DROPS EVERY FRIDAY ✦ BLACK POTHEADS ✦
              </span>
            ))}
          </div>
        </div>
      </section>

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
