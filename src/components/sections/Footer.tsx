import { motion } from 'framer-motion';
import { Instagram, Twitter, Skull } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  support: [
    { label: 'FAQ', path: '/faq' },
    { label: 'Shipping Policy', path: '/legal/shipping-policy' },
    { label: 'Refund Policy', path: '/legal/refund-policy' },
  ],
  legal: [
    { label: 'Terms & Conditions', path: '/legal/terms' },
    { label: 'Privacy Policy', path: '/legal/privacy-policy' },
  ],
  company: [
    { label: 'About Us', path: '/about' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-border">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Skull size={24} className="text-primary" />
              <h4 className="font-display text-2xl">BLACK POTHEADS</h4>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Premium printed tees for the unapologetically bold.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="https://instagram.com/blackpotheads"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                href="https://twitter.com/blackpotheads"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <Twitter size={18} />
              </motion.a>
            </div>
          </div>

          <div>
            <h5 className="font-display text-lg uppercase tracking-wider mb-4">Support</h5>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-display text-lg uppercase tracking-wider mb-4">Legal</h5>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-display text-lg uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-muted-foreground text-sm">
            © 2026 BLACK POTHEADS. All rights reserved.
          </p>
          <div className="flex gap-6 text-muted-foreground text-sm">
            <Link to="/legal/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
