import { lazy, Suspense, useEffect, useState } from 'react';
import { AboutBrandSection } from '@/components/sections/AboutBrandSection';
import { BrandMarquee } from '@/components/sections/BrandMarquee';
import { CategoriesShowcase } from '@/components/sections/CategoriesShowcase';
import { CollabSection } from '@/components/sections/CollabSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ScrollingText } from '@/components/sections/ScrollingText';
import { TrendingSection } from '@/components/sections/TrendingSection';
import { SEO } from '@/components/SEO';
import { productApi } from '@/lib/api';
import { useWishlistStore } from '@/store/wishlistStore';
import { ApiProduct, Product, normalizeProduct } from '@/types/product';
import { toast } from 'sonner';

// ── Skull is lazy-loaded — Three.js (~3MB) does NOT block initial render ──────
const SkullHero = lazy(() => import('@/components/sections/SkullHero'));

// ─── Index ────────────────────────────────────────────────────────────────────
const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => { loadFeaturedProducts(); }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data: any = await productApi.getFeatured(3);
      const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
      setFeaturedProducts(normalized);
      const wishlistIds = data.products
        .filter((p: ApiProduct) => p.in_wishlist)
        .map((p: ApiProduct) => p._id);
      if (wishlistIds.length > 0) {
        useWishlistStore.getState().syncWishlist(wishlistIds);
      }
    } catch (error: any) {
      toast.error('Failed to load featured products');
    }
  };

  return (
    <div className="min-h-screen bg-black w-full overflow-x-hidden">
      <SEO
        title="Blackpotheads - Psy Clothing | Premium Streetwear Brand"
        description="Buy psychedelic t-shirts & streetwear in India. Shop unique Shiva, gothic & trippy printed tees at Blackpotheads. Premium quality. Free shipping, COD & easy returns."
        keywords="printed t-shirts india, streetwear india, graphic tees, Psychedelic streetwear, Trippy streetwear, shiva t-shirts, psychedelic clothing, gothic tees, premium cotton tshirts, online tshirt shopping india, blackpotheads, rick and morty tshirts, chakra clothing"
        url="https://blackpotheads.com/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "BLACK POTHEADS",
          "description": "Premium printed t-shirts and streetwear brand in India",
          "url": "https://blackpotheads.com",
          "logo": "https://blackpotheads.com/logo.png",
          "image": "https://blackpotheads.com/homeimg.jpeg",
          "priceRange": "₹₹",
          "address": { "@type": "PostalAddress", "addressCountry": "IN" },
          "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
          "currenciesAccepted": "INR",
          "openingHours": "Mo-Su 00:00-23:59",
          "telephone": "+91-XXXXXXXXXX",
          "email": "support@blackpotheads.com"
        }}
      />

      {/* ── 3D SKULL HERO — lazy loaded, black bg shows instantly ── */}
      <div className="relative h-screen bg-black">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <SkullHero />
        </Suspense>
      </div>

      <BrandMarquee />
      <CategoriesShowcase />  
      <CollabSection />
      <ScrollingText />
      <TrendingSection />
      <AboutBrandSection />
      <ProcessSection />
    </div>
  );
};

export default Index;
