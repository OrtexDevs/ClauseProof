import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glass?: boolean;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = false,
  glass = false,
  title,
  subtitle,
  action,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'rounded-2xl p-6 border transition-all duration-300',
        glass 
          ? 'bg-card/70 backdrop-blur-md border-white/10 shadow-glass' 
          : 'bg-card border-white/5',
        glow ? 'hover:border-primary/50 hover:shadow-glow' : 'hover:border-white/15',
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-100 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
