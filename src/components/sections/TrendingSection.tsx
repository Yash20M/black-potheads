import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';

const trendingProducts = products.slice(0, 4);

export const TrendingSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  return (
    <section ref={containerRef} className="py-32 bg-card overflow-hidden">
      <motion.div style={{ opacity, scale }} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8"
        >
          <div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              className="h-1 bg-primary mb-6"
            />
            <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
              Most Popular
            </span>
            <h2 className="font-display text-5xl md:text-7xl">
              TRENDING<br />
              <span className="text-accent-gradient">RIGHT NOW</span>
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-md text-lg"
          >
            The pieces everyone's talking about. Limited quantities, 
            unlimited style. Don't miss out on the hottest drops.
          </motion.p>
        </motion.div>

        {/* Product Grid - Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {trendingProducts.map((product, index) => (
            <TrendingProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/shop">
              View All Trending
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const TrendingProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Asymmetric grid positioning
  const gridClasses = [
    'lg:col-span-7 lg:row-span-2',
    'lg:col-span-5',
    'lg:col-span-5',
    'lg:col-span-12',
  ];

  const heights = [
    'h-[500px] lg:h-full',
    'h-[300px]',
    'h-[300px]',
    'h-[400px]',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`${gridClasses[index]} relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className={`block ${heights[index]} relative overflow-hidden`}>
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
          animate={{ opacity: isHovered ? 0.9 : 0.6 }}
        />

        {/* Badge */}
        {product.badge && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute top-4 left-4 px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-wider font-medium"
          >
            {product.badge}
          </motion.div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.div
            animate={{ y: isHovered ? -10 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              {product.category}
            </span>
            <h3 className="font-display text-2xl md:text-3xl mt-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xl font-medium mt-2">${product.price}</p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="flex gap-3 mt-4"
          >
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Eye size={16} className="mr-2" />
              Quick View
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                addItem(product, product.sizes[0]);
              }}
            >
              <ShoppingBag size={16} className="mr-2" />
              Add to Cart
            </Button>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};
