import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'FREE SHIPPING',
    description: 'On all orders over $150. Worldwide delivery within 5-7 days.',
  },
  {
    icon: Shield,
    title: 'AUTHENTIC QUALITY',
    description: 'Premium materials and craftsmanship. 100% genuine products.',
  },
  {
    icon: RefreshCw,
    title: 'EASY RETURNS',
    description: '30-day hassle-free returns. No questions asked policy.',
  },
  {
    icon: Headphones,
    title: '24/7 SUPPORT',
    description: 'Our team is here to help. Reach out anytime, anywhere.',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 mx-auto mb-6 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300"
              >
                <feature.icon size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
              <h3 className="font-display text-xl mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
