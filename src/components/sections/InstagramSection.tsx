import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import heroImage from '@/assets/hero-model.jpg';
import collectionBanner from '@/assets/collection-banner.jpg';
import hoodie from '@/assets/products/hoodie-black.jpg';
import cargo from '@/assets/products/cargo-olive.jpg';
import tee from '@/assets/products/tee-white.jpg';
import sneakers from '@/assets/products/sneakers-black.jpg';

const instagramPosts = [
  { image: heroImage, likes: '2.4k' },
  { image: hoodie, likes: '1.8k' },
  { image: collectionBanner, likes: '3.2k' },
  { image: cargo, likes: '1.5k' },
  { image: tee, likes: '2.1k' },
  { image: sneakers, likes: '2.8k' },
];

export const InstagramSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            @strtwear
          </span>
          <h2 className="font-display text-5xl md:text-6xl mb-4">FOLLOW THE CULTURE</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tag us in your fits for a chance to be featured
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative aspect-square overflow-hidden group"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-primary/80 flex flex-col items-center justify-center"
              >
                <Instagram size={28} className="text-primary-foreground mb-2" />
                <span className="text-primary-foreground text-sm font-medium">{post.likes} likes</span>
              </motion.div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
