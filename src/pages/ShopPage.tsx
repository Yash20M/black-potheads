import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { Category, Product, normalizeProduct, ApiProduct } from '@/types/product';
import { cn } from '@/lib/utils';
import { productApi } from '@/lib/api';
import { toast } from 'sonner';
import { SkeletonCard } from '@/components/ui/loader';
import { AnimatedDamru } from '@/components/Animateddamru';
import TrishulDamruImg from '@/assets/Trishul-Damru.png';
import MushroomsImg from '@/assets/mushrooms.png';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'Shiva', label: 'Shiva' },
  { id: 'Shrooms', label: 'Shrooms' },
  { id: 'LSD', label: 'LSD' },
  { id: 'Chakras', label: 'Chakras' },
  { id: 'Dark', label: 'Dark' },
  { id: 'Rick n Morty', label: 'Rick n Morty' },
];

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
  'LSD': {
    title: 'LSD Collection',
    subtitle: 'Mind Expansion',
    description: 'Dive into a kaleidoscope of colors and patterns inspired by the psychedelic revolution. Our LSD collection features mesmerizing geometric patterns, optical illusions, and vibrant color combinations that transcend ordinary fashion. Each design is a visual journey, blending sacred geometry with modern street style. Art that challenges perception and celebrates consciousness.',
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
  const [activeCategory, setActiveCategory] = useState<Category>(
    (collectionParam as Category) || 'all'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update active category when URL param changes
  useEffect(() => {
    if (collectionParam) {
      setActiveCategory(collectionParam as Category);
    }
  }, [collectionParam]);

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
      if (activeCategory === 'all') {
        // Load all products without category filter
        const data: any = await productApi.getAll(1, 100);
        const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
        setProducts(normalized);
      } else {
        const data: any = await productApi.getByCategory(activeCategory, 1, 50);
        const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
        setProducts(normalized);
      }
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error('Load products error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

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
    <div className="min-h-screen pt-20 bg-white">
      {/* Page Header */}
      <section className="py-20 bg-black border-b border-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative"
          >
            {currentCollection ? (
              <>
                <span className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4 block">
                  {currentCollection.subtitle}
                </span>
                <div className="relative mb-6">
                  {activeCategory === 'Shiva' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: -180, y: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0.4, 0], 
                        scale: [0.5, 1, 1, 1], 
                        rotate: [-180, 0, 0, 0],
                        y: [0, 0, 0, -200]
                      }}
                      transition={{ 
                        delay: 0.3,
                        duration: 3.5,
                        times: [0, 0.25, 0.7, 1],
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 flex justify-center items-center pointer-events-none"
                      style={{
                        filter: 'brightness(1.5) contrast(1.2)',
                      }}
                    >
                      <motion.img 
                        src={TrishulDamruImg} 
                        alt="Trishul and Damru" 
                        className="h-64 md:h-80 lg:h-96 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: 2,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                  {activeCategory === 'Shrooms' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: -180, y: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0.4, 0], 
                        scale: [0.5, 1, 1, 1], 
                        rotate: [-180, 0, 0, 0],
                        y: [0, 0, 0, -200]
                      }}
                      transition={{ 
                        delay: 0.3,
                        duration: 3.5,
                        times: [0, 0.25, 0.7, 1],
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 flex justify-center items-center pointer-events-none"
                      style={{
                        filter: 'brightness(1.5) contrast(1.2)',
                      }}
                    >
                      <motion.img 
                        src={MushroomsImg} 
                        alt="Psychedelic Mushrooms" 
                        className="h-64 md:h-80 lg:h-96 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: 2,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                  {activeCategory === 'LSD' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: -180, y: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0.4, 0], 
                        scale: [0.5, 1, 1, 1], 
                        rotate: [-180, 0, 0, 0],
                        y: [0, 0, 0, -200]
                      }}
                      transition={{ 
                        delay: 0.3,
                        duration: 3.5,
                        times: [0, 0.25, 0.7, 1],
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 flex justify-center items-center pointer-events-none"
                      style={{
                        filter: 'brightness(1.5) contrast(1.2)',
                      }}
                    >
                      <motion.img 
                        src="/LSD.PNG" 
                        alt="LSD" 
                        className="h-64 md:h-80 lg:h-96 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: 2,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                  {activeCategory === 'Chakras' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: -180, y: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0.4, 0], 
                        scale: [0.5, 1, 1, 1], 
                        rotate: [-180, 0, 0, 0],
                        y: [0, 0, 0, -200]
                      }}
                      transition={{ 
                        delay: 0.3,
                        duration: 3.5,
                        times: [0, 0.25, 0.7, 1],
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 flex justify-center items-center pointer-events-none"
                      style={{
                        filter: 'brightness(1.5) contrast(1.2)',
                      }}
                    >
                      <motion.img 
                        src="/Chakras.PNG" 
                        alt="Chakras" 
                        className="h-64 md:h-80 lg:h-96 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: 2,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                  {activeCategory === 'Dark' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: -180, y: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0.4, 0], 
                        scale: [0.5, 1, 1, 1], 
                        rotate: [-180, 0, 0, 0],
                        y: [0, 0, 0, -200]
                      }}
                      transition={{ 
                        delay: 0.3,
                        duration: 3.5,
                        times: [0, 0.25, 0.7, 1],
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 flex justify-center items-center pointer-events-none"
                      style={{
                        filter: 'brightness(1.5) contrast(1.2)',
                      }}
                    >
                      <motion.img 
                        src="/Dark.PNG" 
                        alt="Dark" 
                        className="h-64 md:h-80 lg:h-96 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: 2,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                  {activeCategory === 'Rick n Morty' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: -180, y: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0.4, 0], 
                        scale: [0.5, 1, 1, 1], 
                        rotate: [-180, 0, 0, 0],
                        y: [0, 0, 0, -200]
                      }}
                      transition={{ 
                        delay: 0.3,
                        duration: 3.5,
                        times: [0, 0.25, 0.7, 1],
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 flex justify-center items-center pointer-events-none"
                      style={{
                        filter: 'brightness(1.5) contrast(1.2)',
                      }}
                    >
                      <motion.img 
                        src="/Rick-N-Morty.PNG" 
                        alt="Rick and Morty" 
                        className="h-64 md:h-80 lg:h-96 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: 2,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                  <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white relative z-10">
                    {currentCollection.title.toUpperCase()}
                  </h1>
                </div>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
                  {currentCollection.description}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  {currentCollection.highlights.map((highlight, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm uppercase tracking-wider border border-white/20"
                    >
                      {highlight}
                    </motion.span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <span className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4 block">
                  Browse Our
                </span>
                <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white">SHOP</h1>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {/* Category Filter */}
          <motion.div
            ref={scrollContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 overflow-x-auto scrollbar-hide"
          >
            <div className="flex md:flex-wrap md:justify-center gap-3 min-w-max md:min-w-0 px-4 md:px-0">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  ref={(el) => (categoryRefs.current[category.id] = el)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(category.id as Category)}
                  className={cn(
                    'px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 border-2 whitespace-nowrap',
                    activeCategory === category.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-black text-black hover:bg-black hover:text-white'
                  )}
                >
                  {category.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Products Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-sm mb-8 text-center"
          >
            {productsCountText}
          </motion.p>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              Array(8).fill(null).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-600">
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
