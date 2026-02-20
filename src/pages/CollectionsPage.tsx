import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const collections = [
  {
    id: 'Shiva',
    title: 'Shiva Collection',
    subtitle: 'Divine Power',
    description: 'Spiritual designs featuring Lord Shiva. Premium prints on cotton.',
    image: '/Shiva.PNG',
  },
  {
    id: 'Shrooms',
    title: 'Shrooms Collection',
    subtitle: 'Psychedelic Art',
    description: 'Trippy mushroom designs. Explore consciousness through fashion.',
    image: '/Shrooms.PNG',
  },
  {
    id: 'LSD',
    title: 'LSD Collection',
    subtitle: 'Mind Expansion',
    description: 'Psychedelic patterns and vibrant colors. Art that transcends.',
    image: '/LSD.PNG',
  },
  {
    id: 'Chakras',
    title: 'Chakras Collection',
    subtitle: 'Energy Centers',
    description: 'Sacred geometry and chakra symbols. Balance your energy.',
    image: '/Chakras.PNG',
  },
  {
    id: 'Dark',
    title: 'Dark Collection',
    subtitle: 'Shadow Realm',
    description: 'Our darkest designs. Embrace the darkness within.',
    image: '/Dark.PNG',
  },
  {
    id: 'Rick n Morty',
    title: 'Rick n Morty',
    subtitle: 'Wubba Lubba',
    description: 'Get schwifty with Rick and Morty designs. Interdimensional style.',
    image: '/Rick-N-Morty.PNG',
  },
];

const CollectionsPage = () => {
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

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {collections.map((collection, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                    !isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Section */}
                  <Link 
                    to={`/shop?collection=${collection.id}`}
                    className={`relative h-[500px] lg:h-[600px] overflow-hidden group ${
                      !isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <motion.img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    />
                  </Link>

                  {/* Content Section */}
                  <div className={`flex flex-col justify-center ${
                    !isEven ? 'lg:order-1 lg:text-right' : 'lg:order-2'
                  }`}>
                    <motion.span 
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="text-sm uppercase tracking-widest text-gray-600 mb-4 block"
                    >
                      {collection.subtitle}
                    </motion.span>
                    
                    <motion.h2 
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="font-display text-5xl md:text-6xl lg:text-7xl mb-6 text-black"
                    >
                      {collection.title.toUpperCase()}
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-700 text-lg mb-8 max-w-md"
                    >
                      {collection.description}
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      <Link 
                        to={`/shop?collection=${collection.id}`}
                        className={`inline-flex items-center gap-2 text-black font-medium hover:gap-4 transition-all duration-300 group ${
                          !isEven ? 'lg:flex-row-reverse' : ''
                        }`}
                      >
                        <span>Shop Collection</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollectionsPage;
