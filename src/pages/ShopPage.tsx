import { motion } from 'framer-motion';
import { useState } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { products, categories } from '@/data/products';
import { Category } from '@/types/product';
import { cn } from '@/lib/utils';

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

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
            <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
              Browse Our
            </span>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl">SHOP</h1>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id as Category)}
                className={cn(
                  'px-6 py-3 text-sm uppercase tracking-wider transition-all duration-300 border',
                  activeCategory === category.id
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                )}
              >
                {category.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Products Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-sm mb-8"
          >
            Showing {filteredProducts.length} products
          </motion.p>

          {/* Products Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
