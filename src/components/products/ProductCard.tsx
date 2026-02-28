import { useState, useCallback, memo } from 'react';
import { Plus, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { wishlistApi } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCardComponent = ({ product, index }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const inWishlist = product.inWishlist || isInWishlist(product.id);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.stock || product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    try {
      await addItem(product, selectedSize);
      openCart();
    } catch (error) {
      // Error is already handled in the store with toast
      console.error('Add to cart error:', error);
    }
  }, [product, selectedSize, addItem, openCart]);

  const handleToggleWishlist = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setIsTogglingWishlist(true);
    try {
      if (inWishlist) {
        await wishlistApi.remove(product.id);
        removeFromWishlist(product.id);
        toast.success('Removed from wishlist');
      } else {
        await wishlistApi.add(product.id);
        addToWishlist(product.id);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  }, [user, product.id, inWishlist, addToWishlist, removeFromWishlist]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative opacity-0 animate-fadeIn"
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <Link to={`/product/${product.id}`}>
        {/* Image Container */}
        <div className="relative mb-4">
          <ImageWithSkeleton
            src={product.image}
            alt={product.name}
            aspectRatio="aspect-[3/4]"
            className="transition-transform duration-400 ease-out"
            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
            loading="lazy"
            decoding="async"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isNew && (
              <span className="bg-black text-white px-3 py-1 text-xs uppercase tracking-wider font-bold">
                New
              </span>
            )}
            {product.isSale && (
              <span className="bg-white text-black border-2 border-black px-3 py-1 text-xs uppercase tracking-wider font-bold">
                Sale
              </span>
            )}
          </div>

          {/* Overlay - Only visible on desktop hover, hidden on mobile */}
          <div
            className="hidden md:flex absolute inset-0 bg-black/90 backdrop-blur-sm flex-col items-center justify-center gap-3 sm:gap-4 p-3 sm:p-4 transition-opacity duration-300 pointer-events-none"
            style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none' }}
          >
            {/* Size Selector */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center pointer-events-auto" onClick={(e) => e.preventDefault()}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={cn(
                    'w-8 h-8 sm:w-10 sm:h-10 border-2 text-xs sm:text-sm font-bold transition-all active:scale-95 transform',
                    selectedSize === size
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent border-white text-white hover:bg-white hover:text-black'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pointer-events-auto">
              <button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 uppercase text-sm tracking-wider font-bold border-2 border-white hover:bg-transparent hover:text-white transition-colors disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:hover:text-black active:scale-95 transform"
              >
                <Plus size={18} />
                {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className={cn(
                  'flex items-center justify-center w-12 h-12 border-2 transition-colors active:scale-95 transform',
                  inWishlist
                    ? 'bg-white border-white text-black'
                    : 'border-white bg-transparent text-white hover:bg-white hover:text-black'
                )}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="font-medium text-xs sm:text-sm uppercase tracking-wider line-clamp-2 sm:line-clamp-1 text-black group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-display text-lg sm:text-xl text-black">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-xs sm:text-sm">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {/* Stock Status */}
          {product.stock !== undefined && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs">
              {product.stock > 0 ? (
                <>
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-600"></div>
                  <span className="text-gray-600">
                    {product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-400"></div>
                  <span className="text-gray-400">Out of Stock</span>
                </>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.index === nextProps.index
  );
});
