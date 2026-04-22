import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { Category, Product, normalizeProduct, ApiProduct } from '@/types/product';
import { cn } from '@/lib/utils';
import { productApi } from '@/lib/api';
import { toast } from 'sonner';
import { SkeletonCard } from '@/components/ui/loader';
import { useWishlistStore } from '@/store/wishlistStore';
import { SEO } from '@/components/SEO';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'Shiva', label: 'Shiva' },
  { id: 'Shrooms', label: 'Shrooms' },
  { id: 'ACID', label: 'ACID' },
  { id: 'Chakras', label: 'Chakras' },
  { id: 'Dark', label: 'Dark' },
  { id: 'Rick n Morty', label: 'Rick n Morty' },
];

// Collab config — add new collabs here as they come
const collabConfig: Record<string, { label: string; category: Category; description: string }> = {
  'rakt-pipasu-records': {
    label: 'RAKT PIPASU RECORDS',
    category: 'Shiva',
    description: 'Divine designs inspired by cosmic consciousness and spiritual awakening — a collaboration with Rakt Pipasu Records.',
  },
};

const collectionDetails = {
  'Shiva': {
    title: 'Shiva Collection',
    subtitle: 'Divine Power',
    description: 'Embrace the divine energy of Lord Shiva, the destroyer and transformer. Our Shiva collection features intricate spiritual designs that blend ancient Hindu mythology with contemporary streetwear aesthetics. Each piece is crafted with premium cotton and showcases detailed prints of the third eye, trishul, and cosmic dance of Nataraja. Perfect for those seeking spiritual connection through fashion.',
    highlights: ['Premium Cotton Fabric', 'Detailed Spiritual Artwork', 'Limited Edition Prints', 'Unisex Designs'],
  },
  'Shrooms': {
    title: 'Shrooms Collection',
    subtitle: 'Psychedelic Art',
    description: 'Journey into the mystical world of psychedelic mushrooms with our trippy designs. This collection celebrates consciousness expansion and natural wisdom through vibrant, mind-bending artwork. Featuring colorful mushroom patterns, fractal designs, and nature-inspired motifs that capture the essence of psychedelic experiences. Made for free spirits and consciousness explorers.',
    highlights: ['Vibrant Psychedelic Colors', 'Nature-Inspired Designs', 'Soft Comfortable Fabric', 'Unique Artwork'],
  },
  'ACID': {
    title: 'ACID Collection',
    subtitle: 'Mind Expansion',
    description: 'Dive into a kaleidoscope of colors and patterns inspired by the psychedelic revolution. Our ACID collection features mesmerizing geometric patterns, optical illusions, and vibrant color combinations that transcend ordinary fashion. Each design is a visual journey, blending sacred geometry with modern street style. Art that challenges perception and celebrates consciousness.',
    highlights: ['Geometric Patterns', 'Optical Illusions', 'Bold Color Palettes', 'Premium Quality Prints'],
  },
  'Chakras': {
    title: 'Chakras Collection',
    subtitle: 'Energy Centers',
    description: 'Align your energy centers with our Chakras collection, featuring sacred geometry and ancient symbols of spiritual balance. Each design represents the seven chakras, from root to crown, incorporating mandalas, lotus flowers, and energy flow patterns. These pieces are perfect for yoga enthusiasts, meditation practitioners, and anyone seeking harmony between body, mind, and spirit.',
    highlights: ['Sacred Geometry', 'Seven Chakra Symbols', 'Meditation-Inspired', 'Spiritual Balance'],
  },
  'Dark': {
    title: 'Dark Collection',
    subtitle: 'Shadow Realm',
    description: 'Embrace the darkness within with our most mysterious and edgy collection. The Dark collection features gothic aesthetics, occult symbolism, and shadow-inspired designs that celebrate the beauty of the night. From skulls and ravens to mystical symbols and dark cosmic patterns, these pieces are for those who find power in the shadows and beauty in the darkness.',
    highlights: ['Gothic Aesthetics', 'Occult Symbolism', 'Dark Color Schemes', 'Edgy Street Style'],
  },
  'Rick n Morty': {
    title: 'Rick n Morty',
    subtitle: 'Wubba Lubba',
    description: 'Get schwifty with our interdimensional Rick and Morty collection! Featuring iconic characters, memorable quotes, and scenes from across the multiverse. From portal guns to Pickle Rick, these designs capture the chaotic genius and dark humor of the show. Perfect for fans who appreciate science, sarcasm, and interdimensional adventures. Wubba lubba dub dub!',
    highlights: ['Official-Style Artwork', 'Iconic Characters', 'Multiverse Designs', 'Fan Favorite Quotes'],
  },
};

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const collectionParam = searchParams.get('collection');
  const collabParam = searchParams.get('collab');

  // Resolve active collab config (if any)
  const activeCollab = collabParam ? collabConfig[collabParam] ?? null : null;

  const [activeCategory, setActiveCategory] = useState<Category>(
    activeCollab ? activeCollab.category : (collectionParam as Category) || 'all'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update active category when URL param changes
  useEffect(() => {
    if (collabParam && collabConfig[collabParam]) {
      setActiveCategory(collabConfig[collabParam].category);
    } else if (collectionParam) {
      setActiveCategory(collectionParam as Category);
    }
  }, [collectionParam, collabParam]);

  // Scroll active button into view horizontally only
  useEffect(() => {
    const activeButton = categoryRefs.current[activeCategory];
    const container = scrollContainerRef.current;
    
    if (activeButton && container) {
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  // Get current collection details
  const currentCollection = activeCategory !== 'all' 
    ? collectionDetails[activeCategory as keyof typeof collectionDetails]
    : null;

  // Memoize the load products function
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (collabParam && collabConfig[collabParam]) {
        // Collab mode: fetch by collab slug
        const data: any = await productApi.getByCollab(collabParam, 1, 50);
        const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
        setProducts(normalized);
        const wishlistIds = data.products
          .filter((p: ApiProduct) => p.in_wishlist)
          .map((p: ApiProduct) => p._id);
        useWishlistStore.getState().syncWishlist(wishlistIds);
      } else if (activeCategory === 'all') {
        // Load all products without category filter
        const data: any = await productApi.getAll(1, 100);
        const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
        setProducts(normalized);
        
        // Sync wishlist from API response
        const wishlistIds = data.products
          .filter((p: ApiProduct) => p.in_wishlist)
          .map((p: ApiProduct) => p._id);
        useWishlistStore.getState().syncWishlist(wishlistIds);
      } else {
        const data: any = await productApi.getByCategory(activeCategory, 1, 50);
        const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
        setProducts(normalized);
        
        // Sync wishlist from API response
        const wishlistIds = data.products
          .filter((p: ApiProduct) => p.in_wishlist)
          .map((p: ApiProduct) => p._id);
        useWishlistStore.getState().syncWishlist(wishlistIds);
      }
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error('Load products error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, collabParam]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Memoize products count text
  const productsCountText = useMemo(() => {
    if (loading) return 'Loading...';
    return `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;
  }, [loading, products.length]);

  // Memoize category change handler
  const handleCategoryChange = useCallback((categoryId: Category) => {
    setActiveCategory(categoryId);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <SEO
        title={currentCollection 
          ? `${currentCollection.title} - Premium Printed T-Shirts | BLACK POTHEADS`
          : 'Shop Premium Printed T-Shirts Online India | BLACK POTHEADS'}
        description={currentCollection
          ? currentCollection.description
          : 'Browse our complete collection of premium printed t-shirts. Shiva, psychedelic, gothic, chakra & Rick and Morty designs. Free shipping, COD available.'}
        keywords={`${activeCategory} t-shirts, ${activeCategory} clothing india, printed tees, streetwear, graphic tshirts, blackpotheads`}
        url={`https://blackpotheads.com/shop${activeCategory !== 'all' ? `?collection=${activeCategory}` : ''}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": currentCollection ? currentCollection.title : "Shop All Products",
          "description": currentCollection ? currentCollection.description : "Browse our complete collection of premium printed t-shirts",
          "url": `https://blackpotheads.com/shop${activeCategory !== 'all' ? `?collection=${activeCategory}` : ''}`,
          "numberOfItems": products.length
        }}
      />
      {/* Page Header */}
      <section className="py-8 sm:py-10 md:py-12 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-400 mb-3 sm:mb-4 block">
              {activeCollab ? 'Collab Collection' : 'Welcome to'}
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-4xl text-white">
              {activeCollab ? activeCollab.label : 'Gateway to the Cult'}
            </h1>
            {activeCollab && (
              <p className="text-white/60 text-sm mt-3 max-w-md mx-auto">{activeCollab.description}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 sm:py-10 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Category Filter — hidden in collab mode, replaced by single collab tab */}
          <motion.div
            ref={scrollContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 sm:mb-10 overflow-x-auto scrollbar-hide"
          >
            <div className="flex md:flex-wrap md:justify-center gap-2 sm:gap-3 min-w-max md:min-w-0 px-2 sm:px-4 md:px-0">
              {activeCollab ? (
                // Collab mode: single non-clickable tab showing the collab name
                <div className="px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 text-xs sm:text-sm md:text-sm uppercase tracking-[0.15em] sm:tracking-[0.18em] md:tracking-[0.2em] border-2 bg-white text-black border-white whitespace-nowrap">
                  {activeCollab.label}
                </div>
              ) : (
                categories.map((category) => (
                  <motion.button
                    key={category.id}
                    ref={(el) => (categoryRefs.current[category.id] = el)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryChange(category.id as Category)}
                    className={cn(
                      'px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 text-xs sm:text-sm md:text-sm uppercase tracking-[0.15em] sm:tracking-[0.18em] md:tracking-[0.2em] transition-all duration-300 border-2 whitespace-nowrap',
                      activeCategory === category.id
                        ? 'bg-white text-black border-white'
                        : 'bg-black border-white text-white hover:bg-white hover:text-black'
                    )}
                  >
                    {category.label}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>

          {/* Products Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-8 text-center"
          >
            {productsCountText}
          </motion.p>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {loading ? (
              Array(8).fill(null).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No products found in this category
              </div>
            ) : (
              products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            )}
          </div>
        </div>
      </section>


    </div>
  );
};

export default ShopPage;
