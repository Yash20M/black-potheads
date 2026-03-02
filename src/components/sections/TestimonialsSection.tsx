import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Marcus J.',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'The skull print is insane. Heavyweight cotton, no cheap feel. This is what real streetwear looks like.',
    product: 'Death\'s Embrace Tee',
  },
  {
    id: 2,
    name: 'Raven K.',
    location: 'Brooklyn, NY',
    rating: 5,
    text: 'Finally a brand that gets dark aesthetics. The gothic rose tee is my new favorite. Quality is unmatched.',
    product: 'Dark Rose Tee',
  },
  {
    id: 3,
    name: 'Tyler R.',
    location: 'Chicago, IL',
    rating: 5,
    text: 'Been rocking Black Potheads for a year now. The limited drops are always worth the wait. Pure fire.',
    product: 'Venom Strike Tee',
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            Community
          </span>
          <h2 className="font-display text-5xl md:text-6xl">WHAT THEY SAY</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-secondary p-8 relative group"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                className="absolute -top-4 -left-4 w-10 h-10 bg-primary flex items-center justify-center"
              >
                <Quote size={20} className="text-primary-foreground" />
              </motion.div>

              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating).fill(null).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.4 + i * 0.1 }}
                  >
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="border-t border-border pt-4">
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                <p className="text-xs text-primary mt-1">Purchased: {testimonial.product}</p>
              </div>

              <div className="absolute inset-0 border border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
