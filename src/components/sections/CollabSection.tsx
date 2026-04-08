import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CollabFormModal } from '@/components/CollabFormModal';

export const CollabSection = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="w-full bg-black py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 md:mb-8"
          >
            <span className="text-white">YOUR ART.</span>
            <br />
            <span className="text-primary">OUR PLATFORM!</span>
          </motion.h2>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-3 md:space-y-4 mb-8 md:mb-10"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
              We collaborate with underground artists and creators
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              and turn their work into wearable revolution.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white font-medium">
              If you've got the vision, we've got the platform.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 md:px-12 py-4 md:py-6 text-base md:text-lg uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Join the Movement
            </Button>
          </motion.div>

          {/* Decorative Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-12 md:mt-16 max-w-md mx-auto"
          />
        </motion.div>
      </div>

      {/* Collab Form Modal */}
      <CollabFormModal isOpen={showForm} onClose={() => setShowForm(false)} />
    </section>
  );
};
