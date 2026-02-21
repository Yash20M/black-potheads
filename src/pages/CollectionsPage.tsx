import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const collections = [
  {
    id: 'Shiva',
    title: 'Shiva Collection',
    subtitle: 'Divine Power',
    description: 'Embrace the divine energy of Lord Shiva, the destroyer and transformer. Our Shiva collection features intricate spiritual designs that blend ancient Hindu mythology with contemporary streetwear aesthetics. Each piece is crafted with premium cotton and showcases detailed prints of the third eye, trishul, and cosmic dance of Nataraja.',
    features: ['Premium Cotton', 'Spiritual Artwork', 'Limited Edition', 'Unisex Designs'],
    image: '/Shiva.PNG',
  },
  {
    id: 'Shrooms',
    title: 'Shrooms Collection',
    subtitle: 'Psychedelic Art',
    description: 'Journey into the mystical world of psychedelic mushrooms with our trippy designs. This collection celebrates consciousness expansion and natural wisdom through vibrant, mind-bending artwork. Featuring colorful mushroom patterns, fractal designs, and nature-inspired motifs that capture the essence of psychedelic experiences.',
    features: ['Vibrant Colors', 'Nature-Inspired', 'Soft Fabric', 'Unique Artwork'],
    image: '/Shrooms.PNG',
  },
  {
    id: 'LSD',
    title: 'LSD Collection',
    subtitle: 'Mind Expansion',
    description: 'Dive into a kaleidoscope of colors and patterns inspired by the psychedelic revolution. Our LSD collection features mesmerizing geometric patterns, optical illusions, and vibrant color combinations that transcend ordinary fashion. Each design is a visual journey, blending sacred geometry with modern street style.',
    features: ['Geometric Patterns', 'Optical Illusions', 'Bold Colors', 'Premium Prints'],
    image: '/LSD.PNG',
  },
  {
    id: 'Chakras',
    title: 'Chakras Collection',
    subtitle: 'Energy Centers',
    description: 'Align your energy centers with our Chakras collection, featuring sacred geometry and ancient symbols of spiritual balance. Each design represents the seven chakras, from root to crown, incorporating mandalas, lotus flowers, and energy flow patterns. Perfect for yoga enthusiasts and meditation practitioners.',
    features: ['Sacred Geometry', 'Seven Chakras', 'Meditation-Inspired', 'Spiritual Balance'],
    image: '/Chakras.PNG',
  },
  {
    id: 'Dark',
    title: 'Dark Collection',
    subtitle: 'Shadow Realm',
    description: 'Embrace the darkness within with our most mysterious and edgy collection. The Dark collection features gothic aesthetics, occult symbolism, and shadow-inspired designs that celebrate the beauty of the night. From skulls and ravens to mystical symbols and dark cosmic patterns, these pieces are for those who find power in the shadows.',
    features: ['Gothic Aesthetics', 'Occult Symbolism', 'Dark Schemes', 'Edgy Street Style'],
    image: '/Dark.PNG',
  },
  {
    id: 'Rick n Morty',
    title: 'Rick n Morty',
    subtitle: 'Wubba Lubba',
    description: 'Get schwifty with our interdimensional Rick and Morty collection! Featuring iconic characters, memorable quotes, and scenes from across the multiverse. From portal guns to Pickle Rick, these designs capture the chaotic genius and dark humor of the show. Perfect for fans who appreciate science, sarcasm, and interdimensional adventures.',
    features: ['Official-Style Art', 'Iconic Characters', 'Multiverse Designs', 'Fan Favorites'],
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
                    className={`relative h-[400px] sm:h-[450px] lg:h-[600px] overflow-hidden group ${
                      !isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <motion.img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-contain sm:object-cover"
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
                      className="text-gray-700 text-lg mb-6 max-w-xl leading-relaxed"
                    >
                      {collection.description}
                    </motion.p>

                    {/* Features Grid */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className={`grid grid-cols-2 gap-3 mb-8 max-w-md ${!isEven ? 'lg:ml-auto' : ''}`}
                    >
                      {collection.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-black"></div>
                          <span className="text-sm text-gray-600 uppercase tracking-wide">{feature}</span>
                        </div>
                      ))}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                    >
                      <Link 
                        to={`/shop?collection=${collection.id}`}
                        className={`group inline-flex items-center gap-3 bg-black text-white px-8 py-4 uppercase text-sm tracking-wider font-bold hover:bg-gray-900 transition-all duration-300 relative overflow-hidden ${
                          !isEven ? 'lg:flex-row-reverse' : ''
                        }`}
                      >
                        <span className="relative z-10">Shop Collection</span>
                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
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
