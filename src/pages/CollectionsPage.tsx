import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import collectionBanner from '@/assets/collection-banner.jpg';
import heroImage from '@/assets/hero-model.jpg';

const collections = [
  {
    id: 'winter-2025',
    title: 'Winter 2025',
    subtitle: 'Featured Collection',
    description: 'Premium outerwear and essentials for the colder months.',
    count: 32,
    image: collectionBanner,
    featured: true,
  },
  {
    id: 'essentials',
    title: 'Essentials',
    subtitle: 'Timeless Basics',
    description: 'Core pieces that form the foundation of any wardrobe.',
    count: 24,
    image: heroImage,
    featured: false,
  },
  {
    id: 'urban-core',
    title: 'Urban Core',
    subtitle: 'Street Ready',
    description: 'Bold pieces designed for the concrete jungle.',
    count: 18,
    image: collectionBanner,
    featured: false,
  },
  {
    id: 'limited-edition',
    title: 'Limited Edition',
    subtitle: 'Exclusive Drops',
    description: 'One-time releases. Once they\'re gone, they\'re gone.',
    count: 6,
    image: heroImage,
    featured: false,
  },
];

const CollectionsPage = () => {
  const featuredCollection = collections.find((c) => c.featured);
  const otherCollections = collections.filter((c) => !c.featured);

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
              Explore Our
            </span>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl">COLLECTIONS</h1>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection */}
      {featuredCollection && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] overflow-hidden group"
            >
              <Link to="/shop">
                <motion.img
                  src={featuredCollection.image}
                  alt={featuredCollection.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-xl px-8 md:px-16">
                    <span className="text-primary text-sm uppercase tracking-widest mb-4 block">
                      {featuredCollection.subtitle}
                    </span>
                    <h2 className="font-display text-5xl md:text-7xl mb-4">
                      {featuredCollection.title.toUpperCase()}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6">
                      {featuredCollection.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {featuredCollection.count} items
                      </span>
                      <motion.span
                        whileHover={{ x: 10 }}
                        className="flex items-center gap-2 text-primary font-medium"
                      >
                        Shop Collection <ArrowRight size={18} />
                      </motion.span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Other Collections Grid */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl mb-12"
          >
            ALL COLLECTIONS
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to="/shop">
                  <div className="relative h-80 overflow-hidden mb-4">
                    <motion.img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>
                  <span className="text-muted-foreground text-sm uppercase tracking-widest">
                    {collection.subtitle}
                  </span>
                  <h3 className="font-display text-3xl mt-1 group-hover:text-primary transition-colors">
                    {collection.title.toUpperCase()}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2">{collection.count} items</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollectionsPage;
