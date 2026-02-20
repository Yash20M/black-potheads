// import { motion, useScroll, useTransform } from 'framer-motion';
// import { useRef } from 'react';
// import { Palette, Scissors, Package, Sparkles } from 'lucide-react';

// const steps = [
//   {
//     icon: Palette,
//     number: '01',
//     title: 'DESIGN',
//     description: 'Every piece starts with a vision. Our designers blend street culture with high fashion aesthetics.',
//   },
//   {
//     icon: Scissors,
//     number: '02',
//     title: 'CRAFT',
//     description: 'Premium materials meet expert craftsmanship. Each garment is cut and sewn with precision.',
//   },
//   {
//     icon: Sparkles,
//     number: '03',
//     title: 'PERFECT',
//     description: 'Quality control ensures every detail meets our standards. Only the best makes the cut.',
//   },
//   {
//     icon: Package,
//     number: '04',
//     title: 'DELIVER',
//     description: 'Packaged with care and shipped worldwide. Your piece arrives ready to wear.',
//   },
// ];

export const ProcessSection = () => {
  return null;
};

// export const ProcessSection = () => {
//   const containerRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ['start end', 'end start'],
//   });

//   const lineWidth = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%']);

//   return (
//     <section ref={containerRef} className="py-32 bg-background overflow-hidden">
//       <div className="container mx-auto px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-20"
//         >
//           <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
//             Our Process
//           </span>
//           <h2 className="font-display text-5xl md:text-7xl">HOW WE CREATE</h2>
//         </motion.div>

//         {/* Progress Line */}
//         <div className="relative mb-16 hidden lg:block">
//           <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
//           <motion.div
//             style={{ width: lineWidth }}
//             className="absolute top-1/2 left-0 h-px bg-primary"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
//           {steps.map((step, index) => (
//             <motion.div
//               key={step.number}
//               initial={{ opacity: 0, y: 60 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.2, duration: 0.6 }}
//               className="relative group"
//             >
//               {/* Number Badge */}
//               <motion.div
//                 whileHover={{ scale: 1.1, rotate: 10 }}
//                 className="w-20 h-20 mx-auto mb-8 relative"
//               >
//                 <div className="absolute inset-0 bg-card border border-border group-hover:border-primary transition-colors duration-300 flex items-center justify-center">
//                   <span className="font-display text-3xl text-muted-foreground group-hover:text-primary transition-colors">
//                     {step.number}
//                   </span>
//                 </div>
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   whileInView={{ scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.2 + 0.3, type: 'spring' }}
//                   className="absolute -top-2 -right-2 w-10 h-10 bg-primary flex items-center justify-center"
//                 >
//                   <step.icon size={18} className="text-primary-foreground" />
//                 </motion.div>
//               </motion.div>

//               {/* Content */}
//               <motion.div
//                 whileHover={{ y: -8 }}
//                 className="text-center"
//               >
//                 <h3 className="font-display text-2xl mb-4 group-hover:text-primary transition-colors">
//                   {step.title}
//                 </h3>
//                 <p className="text-muted-foreground text-sm leading-relaxed">
//                   {step.description}
//                 </p>
//               </motion.div>

//               {/* Connector Line (mobile) */}
//               {index < steps.length - 1 && (
//                 <motion.div
//                   initial={{ scaleY: 0 }}
//                   whileInView={{ scaleY: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.2 + 0.5 }}
//                   className="lg:hidden w-px h-12 bg-border mx-auto mt-8 origin-top"
//                 />
//               )}
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
