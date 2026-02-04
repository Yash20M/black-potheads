import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bell, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import collectionBanner from '@/assets/collection-banner.jpg';

const calculateTimeLeft = () => {
  const dropDate = new Date();
  dropDate.setDate(dropDate.getDate() + 7);
  const difference = dropDate.getTime() - new Date().getTime();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export const UpcomingDrop = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 bg-secondary overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative h-[500px] overflow-hidden"
            >
              <img
                src={collectionBanner}
                alt="Upcoming Drop"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-transparent" />
              
              {/* Floating Badge */}
              <motion.div
                initial={{ rotate: -12, scale: 0 }}
                whileInView={{ rotate: -12, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="absolute top-8 right-8 bg-primary px-6 py-3"
              >
                <span className="font-display text-2xl text-primary-foreground">SOON</span>
              </motion.div>
            </motion.div>

            {/* Decorative Element */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '80%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -bottom-4 left-0 h-2 bg-primary"
            />
          </motion.div>

          {/* Content Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={18} className="text-primary" />
                <span className="text-sm uppercase tracking-widest text-primary">
                  Dropping Soon
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-7xl leading-none mb-6">
                SPRING<br />
                <span className="text-accent-gradient">COLLECTION</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md">
                Our most anticipated release yet. 42 new pieces designed for 
                the new season. Limited quantities, first come first served.
              </p>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-4 gap-4 mb-10"
            >
              {Object.entries(timeLeft).map(([unit, value], index) => (
                <motion.div
                  key={unit}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  className="text-center"
                >
                  <div className="bg-card border border-border p-4 mb-2">
                    <motion.span
                      key={value}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-display text-4xl md:text-5xl text-primary block"
                    >
                      {String(value).padStart(2, '0')}
                    </motion.span>
                  </div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">
                    {unit}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Notify Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {!notified ? (
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => setNotified(true)}
                  className="w-full sm:w-auto"
                >
                  <Bell size={20} className="mr-2" />
                  Notify Me When It Drops
                </Button>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-3 text-primary"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="w-10 h-10 bg-primary flex items-center justify-center"
                  >
                    <Bell size={18} className="text-primary-foreground" />
                  </motion.div>
                  <span className="font-medium">You're on the list! We'll notify you.</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
