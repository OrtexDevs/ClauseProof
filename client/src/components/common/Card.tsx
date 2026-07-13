import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glass?: boolean;
  interactive?: boolean;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = false,
  glass = false,
  interactive = false,
  title,
  subtitle,
  action,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'rounded-xl p-6 bg-white border border-[#E4E2D8] shadow-card text-[#16233D] transition-all duration-300 relative overflow-hidden',
        glass && 'glass-panel',
        (interactive || props.onClick) && 'card-interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#E4E2D8]/80 relative z-10">
          <div>
            {title && (
              <h3 className="font-heading text-lg font-bold text-[#16233D] tracking-tight flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-sans text-xs text-[#4A5568] mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
