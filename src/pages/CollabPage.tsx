import { motion } from 'framer-motion';

const CollabPage = () => {
  return (
    <div className="min-h-screen pt-20 bg-black">
      {/* Temporary Shiva Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6 text-white">
                COMING SOON
              </h1>
              <p className="text-xl md:text-2xl text-white/70">
                Artist Collaboration Platform
              </p>
            </motion.div>

            {/* Shiva Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative max-w-3xl mx-auto mb-12"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
                <img
                  src="/shiva.jpeg"
                  alt="Shiva Collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                    SHIVA COLLECTION
                  </h2>
                  <p className="text-white/90 text-lg md:text-xl leading-relaxed">
                    Divine designs inspired by cosmic consciousness and spiritual awakening.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 md:p-12">
                <h3 className="font-display text-2xl md:text-3xl text-white mb-4">
                  JOIN THE MOVEMENT
                </h3>
                <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-6">
                  We're building a platform where underground artists and creators can collaborate 
                  with us to turn their visions into wearable art. If you've got the vision, 
                  we've got the platform.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="text-left">
                    <h4 className="font-display text-xl text-white mb-3">What We Offer</h4>
                    <ul className="space-y-2 text-white/70">
                      <li>• Fair revenue sharing</li>
                      <li>• Full creative control</li>
                      <li>• Marketing support</li>
                      <li>• Quality production</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-display text-xl text-white mb-3">What We Look For</h4>
                    <ul className="space-y-2 text-white/70">
                      <li>• Unique artistic vision</li>
                      <li>• Consistent style</li>
                      <li>• Passion for streetwear</li>
                      <li>• Collaborative mindset</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-white/60 text-lg">
                Stay tuned for the official launch of our artist collaboration program.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CollabPage;
