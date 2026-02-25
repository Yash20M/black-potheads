import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Skull, Flame, Eye, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-dark.jpg';
import collectionDark from '@/assets/collection-dark.jpg';

const values = [
  { icon: Skull, title: 'UNAPOLOGETIC', description: 'We don\'t water down our vision. Every design is raw, unfiltered, and true to the underground.' },
  { icon: Flame, title: 'HANDCRAFTED', description: 'Each print is designed by independent artists. No mass-produced garbage. Every tee is a statement.' },
  { icon: Eye, title: 'LIMITED RUNS', description: 'We produce in small batches. When a design sells out, it\'s gone forever. No reprints, no exceptions.' },
  { icon: Zap, title: 'PREMIUM QUALITY', description: '100% heavyweight cotton. Screen-printed with care. Built to last through the chaos.' },
];

const AboutPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={heroImage} alt="About Black Potheads" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
        </motion.div>
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex items-center justify-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Skull size={64} className="text-primary mx-auto" />
            </motion.div>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl">
              <span className="text-gradient">OUR</span>{' '}
              <span className="text-accent-gradient">STORY</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mt-4">
              Born from the underground. Built for the bold.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Origin Story */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] overflow-hidden"
            >
              <img src={collectionDark} alt="Our origin" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '80%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute bottom-0 left-0 h-2 bg-primary"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm uppercase tracking-widest text-primary mb-4 block">The Story</span>
              <h2 className="font-display text-5xl md:text-6xl mb-8">
                🌌 BLACK POTHEADS<br /><span className="text-accent-gradient">ORIGIN</span>
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4 font-light italic">
                <p>Before it was fabric,<br />it was frequency.</p>
                <p>Before it was a logo,<br />it was a pulse on a dark dancefloor.</p>
                <p>Black Potheads was born in the space between bass drops —<br />
                that moment when the kick fades,<br />
                the sky turns indigo,<br />
                and thousands move like one organism.</p>
                <p>It didn't begin in fashion.<br />It began in expansion.</p>
                <p>In forests lit by UV mandalas.<br />
                In sunrise sets where time dissolved.<br />
                In conversations about consciousness at 5AM<br />
                when reality felt optional.</p>
                <p>We didn't create clothes.<br />We created a reminder.</p>
                <p>A reminder of that feeling<br />
                when ego melts<br />
                when sound becomes geometry<br />
                when black isn't darkness —<br />
                but the infinite void before creation.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">What We Stand For</span>
            <h2 className="font-display text-5xl md:text-7xl">OUR VALUES</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-secondary p-8 border border-border hover:border-primary transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-16 h-16 bg-card border border-border group-hover:border-primary flex items-center justify-center mb-6 transition-colors"
                >
                  <value.icon size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
                <h3 className="font-display text-2xl mb-3 group-hover:text-primary transition-colors">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <Skull size={48} className="text-primary mx-auto mb-8" />
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight mb-8">
              "WE DON'T MAKE CLOTHES.<br />
              <span className="text-accent-gradient">WE MAKE STATEMENTS."</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Every tee we drop is a canvas. Every print is a voice. 
              Black Potheads isn't just a brand — it's a lifestyle for those who refuse to conform.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
