import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, ZoomIn, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductReviews } from '@/components/ProductReviews';
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
  const { addItem, openCart } = useCartStore();

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
    <div className="min-h-screen pt-20 bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm uppercase tracking-[0.2em]">Back to Shop</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left side - Images section */}
            <div className="lg:sticky lg:top-24 lg:self-start h-fit">
              {/* Mobile Slider View */}
              <div className="lg:hidden">
                <div 
                  className="relative aspect-[3/4] bg-gray-50 overflow-hidden"
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
                    <span className="absolute top-4 left-4 bg-black text-white px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold z-10">New</span>
                  )}
                  {product.isSale && (
                    <span className="absolute top-4 left-4 bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold border-2 border-black z-10">Sale</span>
                  )}

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10"
                      >
                        <ChevronLeft size={20} className="text-black" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10"
                      >
                        <ChevronRight size={20} className="text-black" />
                      </button>
                    </>
                  )}

                  {/* Dots Indicator */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {product.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedImage(idx);
                            setImageError(false);
                          }}
                          className={cn(
                            'transition-all border border-white',
                            selectedImage === idx 
                              ? 'w-8 h-2 bg-white' 
                              : 'w-2 h-2 bg-white/50'
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail Preview */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide px-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImage(idx);
                          setImageError(false);
                        }}
                        className={cn(
                          'flex-shrink-0 w-16 h-20 border-2 transition-all overflow-hidden',
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
              </div>

              {/* Desktop Grid View */}
              <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* First image - Fixed on left */}
                {product.images[0] && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative aspect-[3/4] bg-gray-50 overflow-hidden group cursor-zoom-in lg:col-span-1"
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
                      <span className="absolute top-4 left-4 bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold border-2 border-black">Sale</span>
                    )}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={20} className="text-black" />
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
                        className="relative aspect-[3/4] bg-gray-50 overflow-hidden group cursor-zoom-in"
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
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn size={20} className="text-black" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Product details */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <h1 className="font-display text-3xl md:text-4xl mb-3 text-black">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-2xl text-black">{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-lg">{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock !== undefined && (
                  <div className="flex items-center gap-2">
                    {product.stock > 0 ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                        <span className="text-sm text-gray-600">
                          {product.stock <= 5 
                            ? `Only ${product.stock} left in stock` 
                            : 'In Stock'}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span className="text-sm text-gray-400">Out of Stock</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed text-sm">{product.description}</p>

              {/* Wide Fit Note */}
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Wide Fit</span><br />
                  Model info and sizing details
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-black font-semibold">Size</span>
                  <button 
                    onClick={() => setActiveDrawer('details')}
                    className="text-xs uppercase tracking-[0.2em] text-black underline hover:no-underline"
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
                        'h-12 border text-sm font-medium transition-all relative',
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-gray-300 hover:border-black text-black'
                      )}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mb-6">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full bg-black hover:bg-gray-800 text-white uppercase tracking-[0.15em] h-14 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                >
                  {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              {/* Info Sections */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setActiveDrawer('details')}
                  className="w-full text-left border-b border-gray-200 pb-3 flex items-center justify-between hover:border-black transition-colors group"
                >
                  <span className="text-sm uppercase tracking-[0.15em] text-black font-medium">Details</span>
                  <Plus size={18} className="text-black group-hover:rotate-90 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveDrawer('shipping')}
                  className="w-full text-left border-b border-gray-200 pb-3 flex items-center justify-between hover:border-black transition-colors group"
                >
                  <span className="text-sm uppercase tracking-[0.15em] text-black font-medium">Shipping & Returns</span>
                  <Plus size={18} className="text-black group-hover:rotate-90 transition-transform" />
                </button>
                <button
                  className="w-full text-left border-b border-gray-200 pb-3 flex items-center justify-between hover:border-black transition-colors group"
                >
                  <span className="text-sm uppercase tracking-[0.15em] text-black font-medium">Assistance</span>
                  <Plus size={18} className="text-black group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Features List */}
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-black mt-0.5 flex-shrink-0" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-black mt-0.5 flex-shrink-0" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-black mt-0.5 flex-shrink-0" />
                  <span>30 Days Free Returns</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-black mt-0.5 flex-shrink-0" />
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
            className="fixed inset-0 z-50 bg-white/98 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 w-12 h-12 bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors z-10 text-black"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors z-10 text-black"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors z-10 text-black"
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
                        'w-2 h-2 rounded-full transition-all border border-black',
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
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
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
                      <p className="text-gray-600 text-sm">
                        {product?.description || 'Premium quality product with unique design. Made from high-quality materials for maximum comfort and durability.'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Material</h3>
                      <p className="text-gray-600 text-sm">100% Premium Quality Material</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Care Instructions</h3>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Machine wash cold</li>
                        <li>• Tumble dry low</li>
                        <li>• Do not bleach</li>
                        <li>• Iron on low heat if needed</li>
                        <li>• Do not dry clean</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Features</h3>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• High-quality construction</li>
                        <li>• Premium materials</li>
                        <li>• Durable design</li>
                        <li>• Comfortable fit</li>
                        <li>• Unique style</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Size Guide</h3>
                      <div className="text-gray-600 space-y-1 text-sm">
                        {product.sizes.map((size, idx) => (
                          <p key={size}>Size {size} - Standard fit</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Shipping Information</h3>
                      <ul className="text-gray-600 space-y-2 text-sm">
                        <li>• Free standard shipping on all orders</li>
                        <li>• Standard shipping: 5-7 business days</li>
                        <li>• Express shipping: 2-3 business days</li>
                        <li>• International shipping available</li>
                        <li>• Orders processed within 24 hours</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Return Policy</h3>
                      <ul className="text-gray-600 space-y-2 text-sm">
                        <li>• 30-day return window</li>
                        <li>• Items must be unworn and unwashed</li>
                        <li>• Original tags must be attached</li>
                        <li>• Free return shipping</li>
                        <li>• Refund processed within 5-7 business days</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Exchange Policy</h3>
                      <ul className="text-gray-600 space-y-2 text-sm">
                        <li>• Free size exchanges</li>
                        <li>• Exchange processed within 3-5 business days</li>
                        <li>• Contact support for exchange requests</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Customer Support</h3>
                      <p className="text-gray-600 text-sm">
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

      {/* Product Reviews Section */}
      {product && <ProductReviews productId={product.id} />}

      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl mb-12 text-black uppercase tracking-wider"
            >
              You May Also Like
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;