import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { wishlistApi } from '@/lib/api';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Shiva', 'Shrooms', 'LSD', 'Chakras', 'Dark', 'Rick n Morty'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [user, activeCategory]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data: any = await wishlistApi.get(activeCategory === 'all' ? undefined : activeCategory);
      const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
      setProducts(normalized);
    } catch (error: any) {
      toast.error('Failed to load wishlist');
      console.error('Wishlist error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await wishlistApi.remove(productId);
      removeFromWishlist(productId);
      // Reload wishlist to get fresh data
      await loadWishlist();
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from wishlist');
      console.error('Remove from wishlist error:', error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    await addItem(product, product.sizes[0]);
    toast.success('Added to cart');
  };

  const handleAddAllToCart = async () => {
    for (const product of products) {
      await addItem(product, product.sizes[0]);
    }
    openCart();
    toast.success(`Added ${products.length} items to cart`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Page Header */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="text-primary" size={32} />
              <span className="text-sm uppercase tracking-widest text-muted-foreground">
                Your Favorites
              </span>
            </div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl">WISHLIST</h1>
            <p className="text-muted-foreground mt-4">
              {products.length} {products.length === 1 ? 'item' : 'items'} saved
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-wider transition-all duration-300 border',
                  activeCategory === category
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                )}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Actions Bar */}
          {products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 bg-card border border-border"
            >
              <p className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? 'product' : 'products'} in your wishlist
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleAddAllToCart}>
                  <ShoppingBag size={16} className="mr-2" />
                  Add All to Cart
                </Button>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4">Loading your wishlist...</p>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart size={64} className="mx-auto text-muted-foreground mb-6" />
              <h2 className="font-display text-3xl mb-4">Your Wishlist is Empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start adding products you love to your wishlist. They'll be saved here for later.
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate('/shop')}>
                Start Shopping
              </Button>
            </motion.div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <WishlistProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

interface WishlistProductCardProps {
  product: Product;
  index: number;
  onRemove: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

const WishlistProductCard = ({ product, index, onRemove, onAddToCart }: WishlistProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    await onRemove(product.id);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onAddToCart(product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageSrc = imageError ? 'https://via.placeholder.com/400x500?text=No+Image' : product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4">
          <motion.img
            src={imageSrc}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Remove Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            onClick={handleRemove}
            disabled={isRemoving}
            className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
          >
            <Trash2 size={18} />
          </motion.button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-primary text-primary-foreground px-3 py-1 text-xs uppercase tracking-wider font-bold">
                New
              </span>
            )}
            {product.isSale && (
              <span className="bg-destructive text-destructive-foreground px-3 py-1 text-xs uppercase tracking-wider font-bold">
                Sale
              </span>
            )}
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center"
          >
            <Button
              variant="hero"
              size="lg"
              onClick={handleAddToCart}
              className="gap-2"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-medium text-sm uppercase tracking-wider line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-sm">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WishlistPage;
