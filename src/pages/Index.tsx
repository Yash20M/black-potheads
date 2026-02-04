import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-model.jpg';
import { ProductCard } from '@/components/products/ProductCard';
import { products } from '@/data/products';
import collectionBanner from '@/assets/collection-banner.jpg';
import { BrandMarquee } from '@/components/sections/BrandMarquee';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { InstagramSection } from '@/components/sections/InstagramSection';
import { LookbookSection } from '@/components/sections/LookbookSection';

const featuredProducts = products.slice(0, 3);

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={heroImage} alt="Streetwear model" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="w-2 h-2 bg-primary animate-pulse" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground">
                New Collection 2025
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-6"
            >
              <span className="text-gradient">DEFINE</span>
              <br />
              <span className="text-accent-gradient">YOUR STYLE</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg md:text-xl text-muted-foreground max-w-md mb-8"
            >
              Premium streetwear crafted for those who refuse to blend in.
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
        </div>

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
                FREE SHIPPING ON ORDERS OVER $150 ✦ NEW ARRIVALS EVERY WEEK ✦
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <BrandMarquee />

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
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook Section */}
      <LookbookSection />

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
                alt="Winter Collection"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6">
                  <span className="text-primary text-sm uppercase tracking-widest mb-4 block">
                    Featured Collection
                  </span>
                  <h3 className="font-display text-5xl md:text-7xl mb-4">WINTER 2025</h3>
                  <p className="text-muted-foreground text-lg mb-6 max-w-md">
                    32 exclusive pieces designed for the urban explorer.
                  </p>
                  <Button variant="hero" size="lg">
                    Explore Collection
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

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
