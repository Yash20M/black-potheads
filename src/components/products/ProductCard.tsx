import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedSize);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link to={`/product/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4">
          {/* Product Image */}
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-primary text-primary-foreground px-3 py-1 text-xs uppercase tracking-wider font-bold"
              >
                New
              </motion.span>
            )}
            {product.isSale && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-destructive text-destructive-foreground px-3 py-1 text-xs uppercase tracking-wider font-bold"
              >
                Sale
              </motion.span>
            )}
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-4"
          >
            {/* Size Selector */}
            <div className="flex flex-wrap gap-2 justify-center" onClick={(e) => e.preventDefault()}>
              {product.sizes.map((size) => (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={cn(
                    'w-10 h-10 border text-sm font-medium transition-all',
                    selectedSize === size
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent border-foreground/50 hover:border-foreground'
                  )}
                >
                  {size}
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 uppercase text-sm tracking-wider font-bold"
              >
                <Plus size={18} />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-center w-12 h-12 border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background transition-colors"
                aria-label="Quick view"
              >
                <Eye size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <motion.h3
            className="font-medium text-sm uppercase tracking-wider line-clamp-1 group-hover:text-primary transition-colors"
          >
            {product.name}
          </motion.h3>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl">${product.price}</span>
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-sm">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
