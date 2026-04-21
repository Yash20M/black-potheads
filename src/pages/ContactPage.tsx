import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle, Instagram, Twitter, Package, Truck, RefreshCw, ShoppingBag, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block mb-6">
              <img 
                src="/logo.png" 
                alt="Black Potheads Logo" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto"
              />
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl">GET IN TOUCH</h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-md mx-auto">
              Questions? Collabs? Wholesale? Hit us up.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Sections */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-5xl md:text-6xl mb-4">SUPPORT & INFO</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know</p>
          </motion.div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {/* Order & Order Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border p-8 hover:border-primary transition-all group"
            >
              <div className="w-16 h-16 bg-secondary border border-border group-hover:border-primary flex items-center justify-center mb-6 transition-colors">
                <Package size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-6">ORDER & STATUS</h3>
              
              <div className="space-y-6 text-sm">
                <div>
                  <p className="font-semibold mb-2">How can I track my order?</p>
                  <p className="text-muted-foreground">Once your order is shipped, you'll receive a tracking link via SMS/email.</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2">My order is not showing updates?</p>
                  <p className="text-muted-foreground">Tracking can take 24–48 hours to activate. If it's still stuck, hit us up.</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2">Can I cancel my order?</p>
                  <p className="text-muted-foreground">Yes — only before it's shipped. After dispatch, cancellation isn't possible. Orders placed on COD may require confirmation before shipping.</p>
                </div>
              </div>
            </motion.div>

            {/* Shipping & Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border p-8 hover:border-primary transition-all group"
            >
              <div className="w-16 h-16 bg-secondary border border-border group-hover:border-primary flex items-center justify-center mb-6 transition-colors">
                <Truck size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-6">SHIPPING & DELIVERY</h3>
              
              <div className="space-y-6 text-sm">
                <div>
                  <p className="font-semibold mb-2">How long does delivery take?</p>
                  <p className="text-muted-foreground">Metro cities: 3–5 days<br />Other locations: 5–8 days</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2">Do you offer COD?</p>
                  <p className="text-muted-foreground">Yes, but we may verify orders before dispatch.</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2">What if I miss my delivery?</p>
                  <p className="text-muted-foreground">The courier will attempt delivery 2–3 times. Please stay reachable. Repeated missed calls may lead to order cancellation.</p>
                </div>
              </div>
            </motion.div>

            {/* Returns & Exchanges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border p-8 hover:border-primary transition-all group"
            >
              <div className="w-16 h-16 bg-secondary border border-border group-hover:border-primary flex items-center justify-center mb-6 transition-colors">
                <RefreshCw size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-6">RETURNS & EXCHANGES</h3>
              
              <div className="space-y-6 text-sm">
                <div>
                  <p className="font-semibold mb-2">Do you offer returns?</p>
                  <p className="text-muted-foreground">We only accept returns for damaged or incorrect products.</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2">What about size exchanges?</p>
                  <p className="text-muted-foreground">Yes — we offer size exchanges within 3 days of delivery.</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2">How do I request an exchange?</p>
                  <p className="text-muted-foreground">Email us with: Order ID, Issue, Product photos (if needed). Items must be unused and in original condition.</p>
                </div>
              </div>
            </motion.div>

            {/* Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border p-8 hover:border-primary transition-all group"
            >
              <div className="w-16 h-16 bg-secondary border border-border group-hover:border-primary flex items-center justify-center mb-6 transition-colors">
                <ShoppingBag size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-6">PRODUCTS</h3>
              
              <div className="space-y-6 text-sm">
                <div>
                  <p className="font-semibold mb-2">Are your T-shirts oversized?</p>
                  <p className="text-muted-foreground">Yes. All our pieces follow a relaxed, oversized fit.</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2">Will prints fade?</p>
                  <p className="text-muted-foreground">No — we use high-quality printing for long-lasting wear.</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2">How do I choose the right size?</p>
                  <p className="text-muted-foreground">Refer to our size chart before ordering on product page. Designed for comfort. Made to stand out.</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border p-8 hover:border-primary transition-all group"
            >
              <div className="w-16 h-16 bg-secondary border border-border group-hover:border-primary flex items-center justify-center mb-6 transition-colors">
                <MessageCircle size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-6">CONTACT US</h3>
              
              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground">Got questions or issues? We're here.</p>
                
                <div>
                  <p className="font-semibold mb-1">Mobile No</p>
                    +91 8949331335
                </div>

                <div>
                  <p className="font-semibold mb-1">Email</p>
                  <a href="mailto:contact@blackpotheads.com" className="text-primary hover:underline">
                    contact@blackpotheads.com
                  </a>
                </div>
                
                
                <div>
                  <p className="font-semibold mb-1">Response Time</p>
                  <p className="text-muted-foreground">24–48 hours</p>
                </div>
                
                <p className="text-muted-foreground italic pt-2">Please include your Order ID for faster support.</p>
              </div>
            </motion.div>

            {/* Collaborations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border p-8 hover:border-primary transition-all group"
            >
              <div className="w-16 h-16 bg-secondary border border-border group-hover:border-primary flex items-center justify-center mb-6 transition-colors">
                <Users size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-6">COLLABORATIONS</h3>
              
              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground">Wanna create with us?</p>
                <p className="text-muted-foreground">We collaborate with creators, artists, and influencers who vibe with our aesthetic.</p>
                
                <div>
                  <p className="font-semibold mb-2">Send us:</p>
                  <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Your Instagram</li>
                    <li>A short intro</li>
                    <li>Why you'd be a good fit</li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <a href="mailto:collab@blackpotheads.com" className="text-primary hover:underline font-semibold">
                    collab@blackpotheads.com
                  </a>
                </div>
                
                <p className="text-muted-foreground italic pt-2">If your vibe matches ours, we'll make something crazy together.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
    
    </div>
  );
};

export default ContactPage;
