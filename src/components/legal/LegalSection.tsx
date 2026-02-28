import { ReactNode } from 'react';

interface LegalSectionProps {
  number?: string;
  title: string;
  children: ReactNode;
}

export const LegalSection = ({ number, title, children }: LegalSectionProps) => {
  return (
    <section className="mb-8">
      <h2 className="font-display text-2xl mb-4 flex items-baseline gap-2">
        {number && <span className="text-primary">{number}.</span>}
        <span>{title}</span>
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
};
