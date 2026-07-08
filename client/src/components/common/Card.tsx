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
          ? 'bg-white/90 backdrop-blur-md border-[#D9CFC7] shadow-glass' 
          : 'bg-white border-[#D9CFC7]',
        glow ? 'hover:border-[#C9B59C] hover:shadow-glow' : 'hover:border-[#C9B59C]/60',
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFE9E3]">
          <div>
            {title && <h3 className="text-lg font-bold text-[#1c1917] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-[#78716c] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
