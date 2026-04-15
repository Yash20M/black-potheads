import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, ZoomIn, Check, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { wishlistApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/products/ProductCard';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { SEO } from '@/components/SEO';
import { productApi } from '@/lib/api';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeDrawer, setActiveDrawer] = useState<'details' | 'shipping' | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, addToWishlist, removeFromWishlist, syncWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const inWishlist = product ? (product.inWishlist || isInWishlist(product.id)) : false;
  const footerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Track scroll to show/hide sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (!buttonsRef.current || !footerRef.current) return;

      const buttonsRect = buttonsRef.current.getBoundingClientRect();
      const footerRect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Show sticky bar when original buttons are scrolled out of view
      const buttonsOutOfView = buttonsRect.bottom < 0;
      
      // Hide sticky bar when footer is in view
      const footerInView = footerRect.top < windowHeight;

      setShowStickyBar(buttonsOutOfView && !footerInView);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [product]);

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
      
      // Sync wishlist status from API
      if (data.product.in_wishlist) {
        syncWishlist([data.product._id]);
      }
      
      // Load related products from same category
      if (data.product.category) {
        const relatedData: any = await productApi.getByCategory(data.product.category, 1, 4);
        const relatedNormalized = relatedData.products
          .filter((p: ApiProduct) => p._id !== id)
          .slice(0, 3)
          .map((p: ApiProduct) => normalizeProduct(p));
        setRelatedProducts(relatedNormalized);
        
        // Sync wishlist for related products
        const wishlistIds = relatedData.products
          .filter((p: ApiProduct) => p.in_wishlist)
          .map((p: ApiProduct) => p._id);
        if (wishlistIds.length > 0) {
          syncWishlist(wishlistIds);
        }
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
    
    if (!product.stock || product.stock === 0) {
      toast.error('This product is out of stock', { duration: 2000 });
      return;
    }
    
    try {
      await addItem(product, selectedSize);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setIsTogglingWishlist(true);
    try {
      if (inWishlist) {
        await wishlistApi.remove(product.id);
        removeFromWishlist(product.id);
        // Update product state to reflect removal
        setProduct(prev => prev ? { ...prev, inWishlist: false } : null);
        toast.success('Removed from wishlist');
      } else {
        await wishlistApi.add(product.id);
        addToWishlist(product.id);
        // Update product state to reflect addition
        setProduct(prev => prev ? { ...prev, inWishlist: true } : null);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handlePrevImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    setImageError(false);
  };

  const handleNextImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    setImageError(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const currentImageSrc = imageError 
    ? 'https://via.placeholder.com/400x500?text=No+Image' 
    : (product?.images[selectedImage] || product?.image || 'https://via.placeholder.com/400x500?text=No+Image');

  return (
    <div className="min-h-screen pt-20 bg-background">
      {product && (
        <SEO
          title={`${product.name} - Premium Printed T-Shirt | BLACK POTHEADS`}
          description={`${product.description || `Buy ${product.name} online in India`}. Premium quality, free shipping, COD available. ${product.stock && product.stock > 0 ? 'In stock' : 'Limited stock'}.`}
          keywords={`${product.name}, ${product.category} t-shirt, printed tshirt, buy online india, blackpotheads`}
          image={product.image}
          url={`https://blackpotheads.com/product/${product.id}`}
          type="product"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description || `Premium ${product.name}`,
            "image": product.images || [product.image],
            "brand": {
              "@type": "Brand",
              "name": "BLACK POTHEADS"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://blackpotheads.com/product/${product.id}`,
              "priceCurrency": "INR",
              "price": product.price,
              "priceValidUntil": "2026-12-31",
              "availability": product.stock && product.stock > 0 
                ? "https://schema.org/InStock" 
                : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "BLACK POTHEADS"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "reviewCount": "10"
            }
          }}
        />
      )}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/shop" className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em]">Back to Shop</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <section className="py-6 sm:py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Left side - Images section */}
            <div className="lg:sticky lg:top-24 lg:self-start h-fit">
              {/* Mobile Slider View */}
              <div className="lg:hidden">
                <div 
                  className="relative aspect-[3/4] bg-muted dark:bg-black/50 overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      src={product.images[selectedImage] || product.image}
                      alt={`${product.name} ${selectedImage + 1}`}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Badges */}
                  {product.isNew && (
                    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black text-white px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold z-10">New</span>
                  )}
                  {product.isSale && (
                    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold border-2 border-primary z-10">Sale</span>
                  )}

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors z-10 border border-border"
                      >
                        <ChevronLeft size={18} className="sm:w-5 sm:h-5 text-foreground" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors z-10 border border-border"
                      >
                        <ChevronRight size={18} className="sm:w-5 sm:h-5 text-foreground" />
                      </button>
                    </>
                  )}

                  {/* Dots Indicator */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                      {product.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedImage(idx);
                            setImageError(false);
                          }}
                          className={cn(
                            'transition-all border border-border',
                            selectedImage === idx 
                              ? 'w-6 h-1.5 sm:w-8 sm:h-2 bg-primary' 
                              : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted'
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail Preview */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto scrollbar-hide px-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImage(idx);
                          setImageError(false);
                        }}
                        className={cn(
                          'flex-shrink-0 w-14 h-16 sm:w-16 sm:h-20 border-2 transition-all overflow-hidden',
                          selectedImage === idx 
                            ? 'border-black' 
                            : 'border-gray-200 opacity-60 hover:opacity-100'
                        )}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x100?text=No+Image';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Description - Mobile */}
                <div className="mt-6 p-4 bg-card border border-border">
                  <h3 className="font-body font-bold uppercase tracking-wider text-sm text-white mb-3">Product Info</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                </div>
              </div>

              {/* Desktop Grid View */}
              <div className={cn(
                "hidden lg:block space-y-4"
              )}>
                <div className={cn(
                  "grid gap-4",
                  product.images.length === 1 ? "grid-cols-1 max-w-xl mx-auto" : "grid-cols-1 lg:grid-cols-2"
                )}>
                  {/* First image - Fixed on left */}
                  {product.images[0] && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        "relative aspect-[3/4] bg-muted dark:bg-black/50 overflow-hidden group cursor-zoom-in",
                        product.images.length === 1 ? "lg:col-span-1" : "lg:col-span-1"
                      )}
                      onClick={() => {
                        setSelectedImage(0);
                        setIsZoomed(true);
                      }}
                    >
                      <motion.img 
                        src={product.images[0]}
                        alt={`${product.name} 1`}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      {product.isNew && (
                        <span className="absolute top-4 left-4 bg-black text-white px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold">New</span>
                      )}
                      {product.isSale && (
                        <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold border-2 border-primary">Sale</span>
                      )}
                      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity border border-border">
                        <ZoomIn size={20} className="text-foreground" />
                      </div>
                    </motion.div>
                  )}

                  {/* Remaining images - Scrolling vertically on right */}
                  {product.images.length > 1 && (
                    <div className="space-y-4 max-h-[600px] lg:max-h-[calc(100vh-120px)] overflow-y-auto pr-2 lg:col-span-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {product.images.slice(1).map((img, index) => (
                        <motion.div
                          key={index + 1}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: (index + 1) * 0.1 }}
                          className="relative aspect-[3/4] bg-muted dark:bg-black/50 overflow-hidden group cursor-zoom-in"
                          onClick={() => {
                            setSelectedImage(index + 1);
                            setIsZoomed(true);
                          }}
                        >
                          <motion.img 
                            src={img}
                            alt={`${product.name} ${index + 2}`}
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity border border-border">
                            <ZoomIn size={20} className="text-foreground" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Description - Desktop */}
                <div className="p-6 bg-card border border-border">
                  <h3 className="font-body font-bold uppercase tracking-wider text-sm text-white mb-3">Product Info</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Right side - Product details */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <h1 className="font-display text-3xl md:text-4xl mb-3 text-foreground">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-2">
                <span className="font-display text-2xl text-foreground">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through text-lg">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              
              {/* Stock Information */}
              <div className="mb-6">
                <p className="text-sm font-medium">
                  {product.stock && product.stock > 0 ? (
                    <span className="text-green-600 dark:text-green-400">
                      {product.stock} units in stock
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      Out of stock
                    </span>
                  )}
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-white font-bold">Size</span>
                  <button 
                    onClick={() => setActiveDrawer('details')}
                    className="text-xs uppercase tracking-[0.2em] text-white underline hover:no-underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'h-12 border-2 text-sm font-medium transition-all relative',
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'bg-black border-white text-white hover:bg-white hover:text-black'
                      )}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div ref={buttonsRef} className="mb-6 flex flex-row gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 border-2 border-white text-white hover:bg-white hover:text-black uppercase tracking-[0.15em] h-11 sm:h-14 text-xs sm:text-sm font-medium disabled:bg-muted disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                >
                  {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 border-2 border-white text-white hover:bg-white hover:text-black uppercase tracking-[0.15em] h-11 sm:h-14 text-xs sm:text-sm font-medium disabled:bg-muted disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                >
                  {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                </Button>
              </div>

              {/* Info Sections */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setActiveDrawer('details')}
                  className="w-full text-left border-b border-border pb-3 flex items-center justify-between hover:border-primary transition-colors group"
                >
                  <span className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">Details</span>
                  <Plus size={18} className="text-foreground group-hover:rotate-90 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveDrawer('shipping')}
                  className="w-full text-left border-b border-border pb-3 flex items-center justify-between hover:border-primary transition-colors group"
                >
                  <span className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">Shipping & Returns</span>
                  <Plus size={18} className="text-foreground group-hover:rotate-90 transition-transform" />
                </button>
                
              </div>

              {/* Features List */}
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>30 Days Free Returns</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Delivery within 3 to 7 working days</span>
                </div>
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
            className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 w-12 h-12 bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors z-10 text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
            >
              <X size={24} />
            </motion.button>

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors z-10 text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors z-10 text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </>
            )}

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
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                }}
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
                        'w-2 h-2 rounded-full transition-all border border-border',
                        selectedImage === idx ? 'bg-primary w-8' : 'bg-muted'
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
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setActiveDrawer(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-white">
                    {activeDrawer === 'details' ? 'Product Details' : 'Shipping & Returns'}
                  </h2>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full transition-colors text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {activeDrawer === 'details' ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2 text-white">Description</h3>
                      <p className="text-muted-foreground text-sm">
                        {product?.description || 'Premium quality product with unique design. Made from high-quality materials for maximum comfort and durability.'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Material</h3>
                      <p className="text-muted-foreground text-sm">100% Premium Quality Material</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Care Instructions</h3>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        <li>• Machine wash cold</li>
                        <li>• Tumble dry low</li>
                        <li>• Do not bleach</li>
                        <li>• Iron on low heat if needed</li>
                        <li>• Do not dry clean</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Features</h3>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        <li>• High-quality construction</li>
                        <li>• Premium materials</li>
                        <li>• Durable design</li>
                        <li>• Comfortable fit</li>
                        <li>• Unique style</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4 text-white">Size Guide (Oversized Fit)</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-3 font-semibold text-white">Size</th>
                              <th className="text-left py-2 px-3 font-semibold text-white">Length (L)</th>
                              <th className="text-left py-2 px-3 font-semibold text-white">Chest (C)</th>
                              <th className="text-left py-2 px-3 font-semibold text-white">Shoulder (S)</th>
                              <th className="text-left py-2 px-3 font-semibold text-white">Sleeve</th>
                            </tr>
                          </thead>
                          <tbody className="text-muted-foreground">
                            <tr className="border-b border-border">
                              <td className="py-2 px-3 font-medium text-white">S</td>
                              <td className="py-2 px-3">26</td>
                              <td className="py-2 px-3">22</td>
                              <td className="py-2 px-3">6.5</td>
                              <td className="py-2 px-3">8.5</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="py-2 px-3 font-medium text-white">M</td>
                              <td className="py-2 px-3">27</td>
                              <td className="py-2 px-3">23</td>
                              <td className="py-2 px-3">7</td>
                              <td className="py-2 px-3">9</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="py-2 px-3 font-medium text-white">L</td>
                              <td className="py-2 px-3">28</td>
                              <td className="py-2 px-3">24</td>
                              <td className="py-2 px-3">7.5</td>
                              <td className="py-2 px-3">9.5</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="py-2 px-3 font-medium text-white">XL</td>
                              <td className="py-2 px-3">29</td>
                              <td className="py-2 px-3">25</td>
                              <td className="py-2 px-3">8</td>
                              <td className="py-2 px-3">10</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="py-2 px-3 font-medium text-white">XXL</td>
                              <td className="py-2 px-3">30</td>
                              <td className="py-2 px-3">26</td>
                              <td className="py-2 px-3">8.5</td>
                              <td className="py-2 px-3">10.5</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                        <p>• All measurements are in inches</p>
                        <p>• This is an oversized fit</p>
                        <p>• Slight variation of 0.5–1 inch may occur</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2 text-white">Shipping Information</h3>
                      <ul className="text-muted-foreground space-y-2 text-sm">
                        <li>• Free standard shipping on all orders</li>
                        <li>• Standard shipping: 5-7 business days</li>
                        <li>• Express shipping: 2-3 business days</li>
                        <li>• International shipping available</li>
                        <li>• Orders processed within 24 hours</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Return Policy</h3>
                      <ul className="text-muted-foreground space-y-2 text-sm">
                        <li>• 30-day return window</li>
                        <li>• Items must be unworn and unwashed</li>
                        <li>• Original tags must be attached</li>
                        <li>• Free return shipping</li>
                        <li>• Refund processed within 5-7 business days</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Exchange Policy</h3>
                      <ul className="text-muted-foreground space-y-2 text-sm">
                        <li>• Free size exchanges</li>
                        <li>• Exchange processed within 3-5 business days</li>
                        <li>• Contact support for exchange requests</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Customer Support</h3>
                      <p className="text-muted-foreground text-sm">
                        Have questions? Contact us at support@store.com or call our customer service line.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <FeaturesSection />

      {relatedProducts.length > 0 && (
        <section className="py-12 sm:py-16 bg-background dark:bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl sm:text-3xl mb-8 sm:mb-10 text-foreground dark:text-white uppercase tracking-wider"
            >
              You May Also Like
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
              {relatedProducts.map((p, index) => (
                <div key={p.id} className="w-full">
                  <ProductCard product={p} index={index} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer reference div */}
      <div ref={footerRef} />

      {/* Sticky Bottom Bar - Flipkart Style */}
      <AnimatePresence>
        {showStickyBar && product && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/20 shadow-[0_-2px_10px_rgba(0,0,0,0.5)]"
          >
            {/* Mobile View - Simple buttons only */}
            <div className="lg:hidden px-4 py-3 flex gap-2">
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 border-2 border-white bg-black text-white hover:bg-white hover:text-black uppercase tracking-wider text-sm font-bold h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
              >
                {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button 
                size="lg"
                className="flex-1 bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-sm font-bold h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
              >
                {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
              </Button>
            </div>

            {/* Desktop View - With product info */}
            <div className="hidden lg:block">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between gap-6">
                  {/* Left: Product Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 object-cover border border-white/20 flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/64x64?text=No+Image';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-base text-white truncate mb-1">{product.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl text-white">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex gap-3 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-white bg-black text-white hover:bg-white hover:text-black uppercase tracking-wider text-sm font-bold px-8 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddToCart}
                      disabled={!product.stock || product.stock === 0}
                    >
                      {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button 
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-sm font-bold px-8 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddToCart}
                      disabled={!product.stock || product.stock === 0}
                    >
                      {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;