import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated: string;
}

export const LegalLayout = ({ children, title, lastUpdated }: LegalLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-12 border-b border-border">
            <h1 className="font-display text-4xl md:text-5xl mb-4">{title}</h1>
            <p className="text-muted-foreground text-sm">
              Last Updated: <span className="font-medium">{lastUpdated}</span>
            </p>
          </div>
          
          <div className="px-8 py-12">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
