import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle, Skull, Instagram, Twitter } from 'lucide-react';
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
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Skull size={40} className="text-primary" />
            </motion.div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl">GET IN TOUCH</h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-md mx-auto">
              Questions? Collabs? Wholesale? Hit us up.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl mb-8">DROP US A LINE</h2>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <label className="text-sm uppercase tracking-wider text-muted-foreground mb-2 block">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="Your name"
                      />
                    </motion.div>
                    <div>
                      <label className="text-sm uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm uppercase tracking-wider text-muted-foreground mb-2 block">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label className="text-sm uppercase tracking-wider text-muted-foreground mb-2 block">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us everything..."
                    />
                  </div>
                  <Button variant="hero" size="xl" type="submit" className="w-full sm:w-auto">
                    <Send size={18} className="mr-2" />
                    Send Message
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-primary p-12 text-center"
                >
                  <CheckCircle size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="font-display text-3xl mb-2">MESSAGE SENT</h3>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </motion.div>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="font-display text-4xl mb-8">INFO</h2>

              {[
                { icon: Mail, label: 'Email', value: 'hello@blackpotheads.com', sub: 'We reply within 24hrs' },
                { icon: MapPin, label: 'Location', value: 'Underground, Worldwide', sub: 'We ship everywhere' },
                { icon: Clock, label: 'Hours', value: 'Mon-Fri 10AM - 6PM PST', sub: 'Weekends? We\'re creating.' },
              ].map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="flex gap-6 p-6 bg-card border border-border hover:border-primary transition-all group"
                >
                  <div className="w-14 h-14 bg-secondary border border-border group-hover:border-primary flex items-center justify-center flex-shrink-0 transition-colors">
                    <info.icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <span className="text-sm uppercase tracking-wider text-muted-foreground">{info.label}</span>
                    <p className="text-lg font-medium mt-1">{info.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{info.sub}</p>
                  </div>
                </motion.div>
              ))}

              {/* Social */}
              <div className="pt-8 border-t border-border">
                <h3 className="font-display text-2xl mb-4">FOLLOW THE CHAOS</h3>
                <div className="flex gap-4">
                  {[Instagram, Twitter].map((Icon, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                    >
                      <Icon size={22} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
