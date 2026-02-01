import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import collectionBanner from '@/assets/collection-banner.jpg';

const collections = [
  {
    title: 'Essentials',
    subtitle: 'Timeless Basics',
    count: '24 items',
  },
  {
    title: 'Urban Core',
    subtitle: 'Street Ready',
    count: '18 items',
  },
  {
    title: 'Limited Edition',
    subtitle: 'Exclusive Drops',
    count: '6 items',
  },
];

export const FeaturedCollections = () => {
  return (
    <section id="collections" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
              Explore
            </span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl">
              COLLECTIONS
            </h2>
          </div>
          <motion.a
            href="#"
            whileHover={{ x: 10 }}
            className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
          >
            View All
            <ArrowRight size={18} className="group-hover:text-primary transition-colors" />
          </motion.a>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Large Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] lg:h-auto lg:row-span-2 overflow-hidden group cursor-pointer"
          >
            <motion.img
              src={collectionBanner}
              alt="Featured Collection"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="text-primary text-sm uppercase tracking-widest mb-2 block">
                Featured
              </span>
              <h3 className="font-display text-4xl md:text-5xl mb-2">WINTER 2025</h3>
              <p className="text-muted-foreground">32 exclusive pieces</p>
            </div>
          </motion.div>

          {/* Collection Cards */}
          {collections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="bg-secondary p-8 flex flex-col justify-between min-h-[200px] cursor-pointer group border border-transparent hover:border-primary transition-all duration-300"
            >
              <div>
                <span className="text-muted-foreground text-sm uppercase tracking-widest">
                  {collection.subtitle}
                </span>
                <h3 className="font-display text-3xl md:text-4xl mt-2 group-hover:text-primary transition-colors">
                  {collection.title}
                </h3>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-muted-foreground text-sm">{collection.count}</span>
                <motion.div
                  initial={{ x: 0, opacity: 0 }}
                  whileHover={{ x: 10 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-primary"
                >
                  <ArrowRight size={20} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
