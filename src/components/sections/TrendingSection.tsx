import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { productApi } from '@/lib/api';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';
import { toast } from 'sonner';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';

export const TrendingSection = () => {
  const containerRef = useRef(null);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  useEffect(() => {
    loadTrendingProducts();
  }, []);

  const loadTrendingProducts = async () => {
    try {
      const data: any = await productApi.getFeatured(4);
      const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
      setTrendingProducts(normalized);
      
      // Sync wishlist from API response
      const wishlistIds = data.products
        .filter((p: ApiProduct) => p.in_wishlist)
        .map((p: ApiProduct) => p._id);
      if (wishlistIds.length > 0) {
        useWishlistStore.getState().syncWishlist(wishlistIds);
      }
    } catch (error: any) {
      toast.error('Failed to load trending products');
      console.error('Trending products error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={containerRef} className="py-32 bg-card overflow-hidden">
      <motion.div style={{ opacity, scale }} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8"
        >
          <div>
            <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} className="h-1 bg-primary mb-6" />
            <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">Most Popular</span>
            <h2 className="font-display text-5xl md:text-7xl">
              TRENDING<br />
              <span className="text-accent-gradient">RIGHT NOW</span>
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-md text-lg"
          >
            The prints everyone's talking about. Limited runs, 
            unlimited darkness. Don't miss out.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {loading ? (
            <div className="lg:col-span-12 text-center py-12 text-muted-foreground">
              Loading trending products...
            </div>
          ) : trendingProducts.length === 0 ? (
            <div className="lg:col-span-12 text-center py-12 text-muted-foreground">
              No trending products available
            </div>
          ) : (
            trendingProducts.map((product, index) => (
              <TrendingProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/shop">
              View All Trending
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const TrendingProductCard = ({ product, index }: { product: Product; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addItem(product, product.sizes[0]);
  };

  const gridClasses = ['lg:col-span-7 lg:row-span-2', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-12'];
  const heights = ['h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px]', 'h-[250px] md:h-[280px] lg:h-[300px]', 'h-[250px] md:h-[280px] lg:h-[300px]', 'h-[280px] md:h-[320px] lg:h-[350px]'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`${gridClasses[index]} relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className={`block ${heights[index]} relative overflow-hidden`}>
        <ImageWithSkeleton
          src={product.image}
          alt={product.name}
          aspectRatio={heights[index]}
          className="max-h-[550px]"
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.6s' }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
          animate={{ opacity: isHovered ? 0.9 : 0.6 }}
        />
        {product.badge && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute top-4 left-4 px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-wider font-medium"
          >
            {product.badge}
          </motion.div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.div animate={{ y: isHovered ? -10 : 0 }} transition={{ duration: 0.3 }}>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">{product.category}</span>
            <h3 className="font-display text-2xl md:text-3xl mt-1 group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-xl font-medium mt-2">₹{product.price}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="flex gap-3 mt-4"
          >
            <Button size="sm" variant="outline" className="flex-1" onClick={(e) => e.preventDefault()}>
              <Eye size={16} className="mr-2" /> Quick View
            </Button>
            <Button size="sm" className="flex-1" onClick={handleAddToCart}>
              <ShoppingBag size={16} className="mr-2" /> Add to Cart
            </Button>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};
