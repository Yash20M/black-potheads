import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Heart, Truck, RotateCcw, Shield, Info, Package, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { wishlistApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/products/ProductCard';
import { productApi } from '@/lib/api';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<'details' | 'shipping' | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data: any = await productApi.getById(id!);
      const normalized = normalizeProduct(data.product);
      setProduct(normalized);
      setSelectedSize(normalized.sizes[0] || '');
      
      // Load related products from same category
      if (data.product.category) {
        const relatedData: any = await productApi.getByCategory(data.product.category, 1, 4);
        const relatedNormalized = relatedData.products
          .filter((p: ApiProduct) => p._id !== id)
          .slice(0, 3)
          .map((p: ApiProduct) => normalizeProduct(p));
        setRelatedProducts(relatedNormalized);
      }
    } catch (error: any) {
      toast.error('Failed to load product');
      console.error('Load product error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      await addItem(product, selectedSize);
    }
    openCart();
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setIsTogglingWishlist(true);
    try {
      await wishlistApi.add(product.id);
      
      if (inWishlist) {
        removeFromWishlist(product.id);
        toast.success('Removed from wishlist');
      } else {
        addToWishlist(product.id);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const currentImageSrc = imageError 
    ? 'https://via.placeholder.com/400x500?text=No+Image' 
    : (product?.images[selectedImage] || product?.image || 'https://via.placeholder.com/400x500?text=No+Image');

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm uppercase tracking-[0.2em]">Back to Shop</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4 group cursor-zoom-in border-2 border-black"
                onClick={() => setIsZoomed(true)}
              >
                <motion.img 
                  src={currentImageSrc}
                  alt={product.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  whileHover={{ scale: 1.05 }}
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-black text-white px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold">New</span>
                )}
                {product.isSale && (
                  <span className="absolute top-4 left-4 bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold border-2 border-black">Sale</span>
                )}
                <div className="absolute bottom-4 right-4 bg-white border-2 border-black p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={20} className="text-black" />
                </div>
              </motion.div>
              
              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedImage(idx);
                        setImageError(false);
                      }}
                      className={cn(
                        'aspect-square overflow-hidden border-2 transition-all',
                        selectedImage === idx ? 'border-black' : 'border-gray-300 hover:border-black'
                      )}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <span className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-2">{product.category}</span>
              <h1 className="font-display text-4xl md:text-5xl mb-4 text-black">{product.name.toUpperCase()}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-3xl text-black">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-xl">${product.originalPrice}</span>
                )}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

              <div className="mb-8">
                <span className="text-xs uppercase tracking-[0.2em] mb-4 block text-black font-bold">Select Size</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[50px] h-12 px-4 border-2 text-sm font-bold uppercase tracking-wider transition-all',
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-black hover:bg-black hover:text-white text-black'
                      )}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <span className="text-xs uppercase tracking-[0.2em] mb-4 block text-black font-bold">Quantity</span>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black"
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span className="w-12 text-center font-display text-2xl text-black">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <Button variant="hero" size="xl" className="flex-1 bg-black hover:bg-gray-900 text-white border-2 border-black uppercase tracking-[0.2em]" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleWishlist}
                  disabled={isTogglingWishlist}
                  className={cn(
                    'w-14 h-14 border-2 flex items-center justify-center transition-colors',
                    inWishlist
                      ? 'bg-black border-black text-white'
                      : 'border-black hover:bg-black hover:text-white text-black'
                  )}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={22} className={inWishlist ? 'fill-current' : ''} />
                </motion.button>
              </div>

              <div className="border-t-2 border-black pt-8 space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <Truck size={20} className="text-black" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <RotateCcw size={20} className="text-black" />
                  <span>30-day free returns</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <Shield size={20} className="text-black" />
                  <span>Premium quality guarantee</span>
                </div>
              </div>

              {/* Info Buttons */}
              <div className="border-t-2 border-black mt-8 pt-8 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white uppercase tracking-[0.15em] text-xs"
                  onClick={() => setActiveDrawer('details')}
                >
                  <Info size={18} className="mr-2" />
                  Product Details
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white uppercase tracking-[0.15em] text-xs"
                  onClick={() => setActiveDrawer('shipping')}
                >
                  <Package size={18} className="mr-2" />
                  Shipping & Returns
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && product && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/98 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 w-12 h-12 bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors z-10 text-black"
              onClick={() => setIsZoomed(false)}
            >
              <X size={24} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImageSrc}
                alt={product.name}
                className="w-full h-full object-contain border-2 border-black"
              />
              {product.images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(idx);
                        setImageError(false);
                      }}
                      className={cn(
                        'w-3 h-3 transition-all border border-black',
                        selectedImage === idx ? 'bg-black w-8' : 'bg-white'
                      )}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Drawer */}
      <AnimatePresence>
        {activeDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setActiveDrawer(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-gray-200 overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-gray-900">
                    {activeDrawer === 'details' ? 'Product Details' : 'Shipping & Returns'}
                  </h2>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {activeDrawer === 'details' ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Description</h3>
                      <p className="text-gray-600">
                        {product?.description || 'Premium quality T-shirt with unique printed design. Made from 100% cotton for maximum comfort and durability.'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Material</h3>
                      <p className="text-gray-600">100% Premium Cotton</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Care Instructions</h3>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Machine wash cold</li>
                        <li>• Tumble dry low</li>
                        <li>• Do not bleach</li>
                        <li>• Iron on low heat if needed</li>
                        <li>• Do not dry clean</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Features</h3>
                      <ul className="text-gray-600 space-y-1">
                        <li>• High-quality screen printing</li>
                        <li>• Pre-shrunk fabric</li>
                        <li>• Reinforced seams</li>
                        <li>• Tagless for comfort</li>
                        <li>• Unisex fit</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Size Guide</h3>
                      <div className="text-gray-600 space-y-1 text-sm">
                        <p>S - Chest: 36-38"</p>
                        <p>M - Chest: 38-40"</p>
                        <p>L - Chest: 42-44"</p>
                        <p>XL - Chest: 46-48"</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Shipping Information</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li>• Free standard shipping on orders over $100</li>
                        <li>• Standard shipping: 5-7 business days</li>
                        <li>• Express shipping: 2-3 business days</li>
                        <li>• International shipping available</li>
                        <li>• Orders processed within 24 hours</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Return Policy</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li>• 30-day return window</li>
                        <li>• Items must be unworn and unwashed</li>
                        <li>• Original tags must be attached</li>
                        <li>• Free return shipping</li>
                        <li>• Refund processed within 5-7 business days</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Exchange Policy</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li>• Free size exchanges</li>
                        <li>• Exchange processed within 3-5 business days</li>
                        <li>• Contact support for exchange requests</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Customer Support</h3>
                      <p className="text-gray-600">
                        Have questions? Contact us at support@blackpotheads.com or call 1-800-POTHEAD
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl mb-12 text-white uppercase tracking-wider"
          >
            MORE FROM {product.category.toUpperCase()}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
