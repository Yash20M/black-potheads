import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import skullTee from '@/assets/products/skull-tee.jpg';
import gothicTee from '@/assets/products/gothic-tee.jpg';
import tribalTee from '@/assets/products/tribal-tee.jpg';
import graffitiTee from '@/assets/products/graffiti-tee.jpg';
import snakeTee from '@/assets/products/snake-tee.jpg';
import collectionDark from '@/assets/collection-dark.jpg';

const collections = [
  {
    id: 'skulls',
    title: 'Skulls & Bones',
    subtitle: 'Death Collection',
    description: 'Our darkest skull prints. Hand-illustrated by tattoo artists.',
    count: 8,
    image: skullTee,
    featured: true,
  },
  {
    id: 'gothic',
    title: 'Gothic Romance',
    subtitle: 'Dark Florals',
    description: 'Roses, thorns, and dark beauty. Gothic elegance on cotton.',
    count: 6,
    image: gothicTee,
    featured: false,
  },
  {
    id: 'tribal',
    title: 'Tribal Fire',
    subtitle: 'Ancient Patterns',
    description: 'Geometric warrior patterns inspired by ancient civilizations.',
    count: 7,
    image: tribalTee,
    featured: false,
  },
  {
    id: 'graffiti',
    title: 'Street Art',
    subtitle: 'Urban Canvas',
    description: 'Neon drips and graffiti tags. The streets on your chest.',
    count: 5,
    image: graffitiTee,
    featured: false,
  },
  {
    id: 'tattoo',
    title: 'Ink & Iron',
    subtitle: 'Tattoo Flash',
    description: 'Traditional flash art meets modern streetwear. Snakes, daggers, and more.',
    count: 6,
    image: snakeTee,
    featured: false,
  },
];

const CollectionsPage = () => {
  const featuredCollection = collections.find((c) => c.featured);
  const otherCollections = collections.filter((c) => !c.featured);

  return (
    <div className="min-h-screen pt-20">
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
                  src={collectionDark}
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
                      <span className="text-sm text-muted-foreground">{featuredCollection.count} items</span>
                      <motion.span whileHover={{ x: 10 }} className="flex items-center gap-2 text-primary font-medium">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
