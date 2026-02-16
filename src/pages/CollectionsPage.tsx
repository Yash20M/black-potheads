import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import collectionDark from '@/assets/collection-dark.jpg';
import skullTee from '@/assets/products/skull-tee.jpg';

const collections = [
  {
    id: 'Shiva',
    title: 'Shiva Collection',
    subtitle: 'Divine Power',
    description: 'Spiritual designs featuring Lord Shiva. Premium prints on cotton.',
    image: skullTee,
    featured: true,
  },
  {
    id: 'Shrooms',
    title: 'Shrooms Collection',
    subtitle: 'Psychedelic Art',
    description: 'Trippy mushroom designs. Explore consciousness through fashion.',
    image: skullTee,
    featured: false,
  },
  {
    id: 'LSD',
    title: 'LSD Collection',
    subtitle: 'Mind Expansion',
    description: 'Psychedelic patterns and vibrant colors. Art that transcends.',
    image: skullTee,
    featured: false,
  },
  {
    id: 'Chakras',
    title: 'Chakras Collection',
    subtitle: 'Energy Centers',
    description: 'Sacred geometry and chakra symbols. Balance your energy.',
    image: skullTee,
    featured: false,
  },
  {
    id: 'Dark',
    title: 'Dark Collection',
    subtitle: 'Shadow Realm',
    description: 'Our darkest designs. Embrace the darkness within.',
    image: skullTee,
    featured: false,
  },
  {
    id: 'Rick n Morty',
    title: 'Rick n Morty',
    subtitle: 'Wubba Lubba',
    description: 'Get schwifty with Rick and Morty designs. Interdimensional style.',
    image: skullTee,
    featured: false,
  },
];

const CollectionsPage = () => {
  const featuredCollection = collections.find((c) => c.featured);
  const otherCollections = collections.filter((c) => !c.featured);

  return (
    <div className="min-h-screen pt-20 bg-white">
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-sm uppercase tracking-widest text-gray-600 mb-4 block">
              Explore Our
            </span>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-black">COLLECTIONS</h1>
          </motion.div>
        </div>
      </section>

      {featuredCollection && (
        <section className="py-16 bg-white">
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-xl px-8 md:px-16">
                    <span className="text-white text-sm uppercase tracking-widest mb-4 block">
                      {featuredCollection.subtitle}
                    </span>
                    <h2 className="font-display text-5xl md:text-7xl mb-4 text-white">
                      {featuredCollection.title.toUpperCase()}
                    </h2>
                    <p className="text-gray-200 text-lg mb-6">
                      {featuredCollection.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <motion.span whileHover={{ x: 10 }} className="flex items-center gap-2 text-white font-medium">
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

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl mb-12 text-black"
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
                  <div className="relative h-80 overflow-hidden mb-4 bg-gray-100">
                    <motion.img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <span className="text-gray-600 text-sm uppercase tracking-widest">
                    {collection.subtitle}
                  </span>
                  <h3 className="font-display text-3xl mt-1 text-black group-hover:text-gray-700 transition-colors">
                    {collection.title.toUpperCase()}
                  </h3>
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
