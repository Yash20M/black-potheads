import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { Category, Product, normalizeProduct, ApiProduct } from '@/types/product';
import { cn } from '@/lib/utils';
import { productApi } from '@/lib/api';
import { toast } from 'sonner';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'Shiva', label: 'Shiva' },
  { id: 'Shrooms', label: 'Shrooms' },
  { id: 'LSD', label: 'LSD' },
  { id: 'Chakras', label: 'Chakras' },
  { id: 'Dark', label: 'Dark' },
  { id: 'Rick n Morty', label: 'Rick n Morty' },
];

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize the load products function
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (activeCategory === 'all') {
        // Load all products without category filter
        const data: any = await productApi.getAll(1, 100);
        const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
        setProducts(normalized);
      } else {
        const data: any = await productApi.getByCategory(activeCategory, 1, 50);
        const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
        setProducts(normalized);
      }
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error('Load products error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Memoize products count text
  const productsCountText = useMemo(() => {
    if (loading) return 'Loading...';
    return `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;
  }, [loading, products.length]);

  // Memoize category change handler
  const handleCategoryChange = useCallback((categoryId: Category) => {
    setActiveCategory(categoryId);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Page Header */}
      <section className="py-20 bg-black border-b border-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4 block">
              Browse Our
            </span>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white">SHOP</h1>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
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
                onClick={() => handleCategoryChange(category.id as Category)}
                className={cn(
                  'px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 border-2',
                  activeCategory === category.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white border-black text-black hover:bg-black hover:text-white'
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
            className="text-gray-600 text-sm mb-8 text-center"
          >
            {productsCountText}
          </motion.p>

          {/* Products Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                No products found in this category
              </div>
            ) : (
              products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
