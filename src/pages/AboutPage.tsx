import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Skull, Flame, Eye, Zap } from 'lucide-react';

const values = [
  { icon: Skull, title: 'UNAPOLOGETIC', description: 'We don\'t water down our vision. Every design is raw, unfiltered, and true to the underground.' },
  { icon: Flame, title: 'HANDCRAFTED', description: 'Each print is designed by independent artists. No mass-produced garbage. Every tee is a statement.' },
  { icon: Eye, title: 'LIMITED RUNS', description: 'We produce in small batches. When a design sells out, it\'s gone forever. No reprints, no exceptions.' },
  { icon: Zap, title: 'PREMIUM QUALITY', description: '100% heavyweight cotton. Screen-printed with care. Built to last through the chaos.' },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20 bg-black">
      {/* Mission Statement - Moved to Top */}
      <section className="py-20 md:py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <img 
                src="/logo.png" 
                alt="Black Potheads Logo" 
                className="w-32 h-32 mx-auto object-contain"
              />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-8 text-white tracking-wide"
            >
              "WE DON'T MAKE CLOTHES.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-white/60 mb-12 tracking-wide"
            >
              WE MAKE STATEMENTS."
            </motion.p>
            
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 200 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-12"
            />
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-white/80 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
            >
              Every tee we drop is a canvas. Every print is a voice. 
              Black Potheads isn't just a brand — it's a lifestyle for those who refuse to conform.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story - Starting Section */}
      <section className="py-24 md:py-32 bg-black relative overflow-hidden border-t border-white/10">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-6"
              >
                <img 
                  src="/logo.png" 
                  alt="Black Potheads Logo" 
                  className="w-32 h-32 mx-auto object-contain"
                />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-body font-bold uppercase tracking-wider text-5xl md:text-7xl lg:text-8xl mb-4 text-white"
              >
                BLACK POTHEADS
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl text-white/40 mb-8 tracking-widest"
              >
                ORIGIN
              </motion.div>
              
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 200 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 1 }}
                className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"
              />
            </div>

            {/* Poetic Content */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
              className="space-y-12"
            >
              {/* Opening Lines */}
              <div className="text-center space-y-6">
                <motion.p 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-light italic text-white/90 leading-relaxed"
                >
                  Before it was fabric,
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-display text-white tracking-wide"
                >
                  IT WAS FREQUENCY.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="py-6"
                >
                  <div className="w-2 h-2 bg-white/30 rounded-full mx-auto" />
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-light italic text-white/90 leading-relaxed"
                >
                  Before it was a logo,
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-display text-white tracking-wide"
                >
                  IT WAS A PULSE ON A DARK DANCEFLOOR.
                </motion.p>
              </div>

              {/* Main Story Block */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative mt-12"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 blur-xl" />
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-2xl">
                  <p className="text-xl md:text-xl lg:text-2xl font-light italic text-white/95 leading-relaxed text-center">
                    Black Potheads was born in the space between bass drops —
                    <br className="hidden md:block" />
                    <span className="block mt-3">that moment when the kick fades,</span>
                    <span className="block mt-2">the sky turns indigo,</span>
                    <span className="block mt-2">and thousands move like one organism.</span>
                  </p>
                </div>
              </motion.div>

              {/* Two Column Cards */}
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-xl hover:border-white/30 hover:bg-white/10 transition-all duration-500 h-full">
                    <p className="text-lg md:text-xl font-light italic text-white/90 leading-relaxed">
                      It didn't begin in fashion.
                      <span className="block mt-4 text-2xl md:text-3xl font-display text-white not-italic tracking-wide">
                        IT BEGAN IN EXPANSION.
                      </span>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-xl hover:border-white/30 hover:bg-white/10 transition-all duration-500 h-full">
                    <p className="text-lg md:text-xl font-light italic text-white/90 leading-relaxed">
                      In forests lit by UV mandalas.
                      <span className="block mt-2">In sunrise sets where time dissolved.</span>
                      <span className="block mt-2">In conversations about consciousness at 5AM</span>
                      <span className="block mt-1">when reality felt optional.</span>
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Closing Statement */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center mt-16 space-y-8"
              >
                <p className="text-2xl md:text-3xl lg:text-4xl font-light italic text-white/90 leading-relaxed">
                  We didn't create clothes.
                </p>
                
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-display text-white tracking-wider"
                >
                  WE CREATED A REMINDER.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="relative mt-12"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl" />
                  <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 p-10 md:p-14 rounded-2xl">
                    <p className="text-xl md:text-xl lg:text-2xl font-light italic text-white leading-relaxed">
                      A reminder of that feeling
                      <span className="block mt-3">when <span className="text-white font-normal">ego melts</span></span>
                      <span className="block mt-2">when <span className="text-white font-normal">sound becomes geometry</span></span>
                      <span className="block mt-2">when <span className="text-white font-normal">black isn't darkness</span> —</span>
                      <span className="block mt-5 text-xl md:text-2xl lg:text-3xl font-display text-white/90 not-italic tracking-wide">
                        BUT THE INFINITE VOID BEFORE CREATION.
                      </span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      {/* <section className="py-24 md:py-32 bg-black border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-sm uppercase tracking-[0.3em] text-white/50 mb-6 block">What We Stand For</span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white tracking-wider">OUR VALUES</h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 150 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mt-8"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl" />
                <div className="relative bg-white/5 backdrop-blur-sm p-8 md:p-10 border border-white/10 hover:border-white/30 transition-all duration-500 rounded-xl h-full">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 bg-white/5 border border-white/20 group-hover:border-white/40 flex items-center justify-center mb-8 transition-colors rounded-lg"
                  >
                    <value.icon size={32} className="text-white/60 group-hover:text-white transition-colors duration-500" />
                  </motion.div>
                  <h3 className="font-display text-2xl md:text-3xl mb-4 group-hover:text-white transition-colors text-white tracking-wide">
                    {value.title}
                  </h3>
                  <p className="text-white/70 group-hover:text-white/90 text-sm md:text-base leading-relaxed transition-colors duration-500">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default AboutPage;
