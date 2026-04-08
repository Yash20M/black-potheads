import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CollabFormModal } from '@/components/CollabFormModal';

const CollabPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen pt-20 bg-black">
      {/* Collaboration Section */}
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
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4 text-white">
                COLLABS X BLACK POTHEADS
              </h1>
              <p className="text-base md:text-lg text-white/70">
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
                  alt="Rakt Pipasu Records"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h2 className="font-display text-xl md:text-2xl lg:text-3xl text-white mb-3">
                    RAKT PIPASU RECORDS
                  </h2>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4">
                    Divine designs inspired by cosmic consciousness and spiritual awakening.
                  </p>
                  
                  {/* Shop Button */}
                  <Button
                    onClick={() => navigate('/shop?collection=Shiva')}
                    className="bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider px-6 py-4 text-sm md:text-base"
                  >
                    Shop Collection
                  </Button>
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
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
               
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4">
                  We're building a platform where underground artists and creators can collaborate 
                  with us to turn their visions into wearable art. If you've got the vision, 
                  we've got the platform.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6 mb-6">
                  <div className="text-left">
                    <h4 className="font-display text-base md:text-lg text-white mb-2">What We Offer</h4>
                    <ul className="space-y-1 text-sm text-white/70">
                      <li>• Fair revenue sharing</li>
                      <li>• Full creative control</li>
                      <li>• Marketing support</li>
                      <li>• Quality production</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-display text-base md:text-lg text-white mb-2">What We Look For</h4>
                    <ul className="space-y-1 text-sm text-white/70">
                      <li>• Unique artistic vision</li>
                      <li>• Consistent style</li>
                      <li>• Passion for streetwear</li>
                      <li>• Collaborative mindset</li>
                    </ul>
                  </div>
                </div>

                {/* Join Button */}
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider px-8 py-4 text-sm md:text-base"
                >
                  Join the Movement
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Form Popup */}
      <CollabFormModal isOpen={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
};

export default CollabPage;
