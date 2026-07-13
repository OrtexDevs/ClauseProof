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
        'rounded-xl p-6 sm:p-7 bg-white border border-[#DCE0D6] shadow-card text-[#0B1120] transition-all duration-300 relative overflow-hidden',
        glass && 'glass-panel',
        (interactive || props.onClick) && 'card-interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#DCE0D6] relative z-10 gap-4">
          <div>
            {title && (
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#0B1120] tracking-tight flex items-center gap-2.5">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-sans text-xs sm:text-sm font-medium text-[#25314C] mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
