import { motion } from 'framer-motion';
import { Instagram, Twitter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerLinks = {
  shop: ['All Products', 'Hoodies', 'Tees', 'Pants', 'Accessories'],
  support: ['FAQ', 'Shipping', 'Returns', 'Size Guide', 'Contact'],
  company: ['About Us', 'Careers', 'Press', 'Sustainability'],
};

export const Footer = () => {
  return (
    <footer id="about" className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h3 className="font-display text-4xl md:text-5xl mb-4">JOIN THE MOVEMENT</h3>
          <p className="text-muted-foreground mb-8">
            Subscribe for exclusive drops, early access, and 10% off your first order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-background border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <Button variant="hero">
              Subscribe
              <ArrowRight size={18} />
            </Button>
          </div>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-border">
          {/* Logo & Social */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display text-3xl mb-4">STRĒET</h4>
            <p className="text-muted-foreground text-sm mb-6">
              Premium streetwear for the bold and uncompromising.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </motion.a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h5 className="font-display text-lg uppercase tracking-wider mb-4">Shop</h5>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h5 className="font-display text-lg uppercase tracking-wider mb-4">Support</h5>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="font-display text-lg uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-muted-foreground text-sm">
            © 2025 STRĒET. All rights reserved.
          </p>
          <div className="flex gap-6 text-muted-foreground text-sm">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
