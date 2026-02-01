import { motion } from 'framer-motion';
import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { products, categories } from '@/data/products';
import { Category } from '@/types/product';
import { cn } from '@/lib/utils';

export const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            Curated Selection
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl">
            NEW ARRIVALS
          </h2>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
