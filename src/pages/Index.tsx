import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Hero } from '@/components/sections/Hero';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FeaturedCollections } from '@/components/sections/FeaturedCollections';
import { Footer } from '@/components/sections/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Cart Drawer */}
      <CartDrawer />
      
      {/* Main Content */}
      <main>
        <Hero />
        <ProductGrid />
        <FeaturedCollections />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
