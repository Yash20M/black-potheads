import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Heart, Truck, RotateCcw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/products/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== id && p.category === product?.category)
    .slice(0, 3);

  // If not enough from same category, fill with others
  const displayRelated = relatedProducts.length >= 3
    ? relatedProducts
    : [...relatedProducts, ...products.filter((p) => p.id !== id && p.category !== product?.category)].slice(0, 3);

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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize);
    }
    openCart();
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm uppercase tracking-wider">Back to Shop</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[3/4] bg-secondary overflow-hidden"
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 text-sm uppercase tracking-wider font-bold">New</span>
              )}
              {product.isSale && (
                <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-4 py-2 text-sm uppercase tracking-wider font-bold">Sale</span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <span className="text-muted-foreground text-sm uppercase tracking-widest mb-2">{product.category}</span>
              <h1 className="font-display text-4xl md:text-5xl mb-4">{product.name.toUpperCase()}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-3xl">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through text-xl">${product.originalPrice}</span>
                )}
              </div>

              <p className="text-muted-foreground mb-8">{product.description}</p>

              <div className="mb-8">
                <span className="text-sm uppercase tracking-wider mb-4 block">Select Size</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[50px] h-12 px-4 border text-sm font-medium transition-all',
                        selectedSize === size
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-transparent border-border hover:border-foreground'
                      )}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <span className="text-sm uppercase tracking-wider mb-4 block">Quantity</span>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border border-border flex items-center justify-center hover:border-foreground transition-colors"
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span className="w-12 text-center font-display text-2xl">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 border border-border flex items-center justify-center hover:border-foreground transition-colors"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <Button variant="hero" size="xl" className="flex-1" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Heart size={22} />
                </motion.button>
              </div>

              <div className="border-t border-border pt-8 space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Truck size={20} />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <RotateCcw size={20} />
                  <span>30-day free returns</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Shield size={20} />
                  <span>Premium quality guarantee</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl mb-12"
          >
            MORE FROM {product.category.toUpperCase()}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayRelated.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
