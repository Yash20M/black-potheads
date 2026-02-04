import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Marcus J.',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'The quality is unmatched. Every piece feels premium and the fit is perfect for the streets.',
    product: 'Midnight Hoodie',
  },
  {
    id: 2,
    name: 'Sarah K.',
    location: 'New York, NY',
    rating: 5,
    text: 'Finally found a brand that gets streetwear. Fast shipping and the packaging is fire.',
    product: 'Urban Cargo Pants',
  },
  {
    id: 3,
    name: 'Tyler R.',
    location: 'Chicago, IL',
    rating: 5,
    text: 'Been rocking STRTWEAR for 2 years now. The limited drops are always worth the wait.',
    product: 'Essential Tee Pack',
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
              {/* Quote Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                className="absolute -top-4 -left-4 w-10 h-10 bg-primary flex items-center justify-center"
              >
                <Quote size={20} className="text-primary-foreground" />
              </motion.div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating).fill(null).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.4 + i * 0.1 }}
                  >
                    <Star size={16} className="fill-primary text-primary" />
                  </motion.div>
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                <p className="text-xs text-primary mt-1">Purchased: {testimonial.product}</p>
              </div>

              {/* Hover Border */}
              <div className="absolute inset-0 border border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
