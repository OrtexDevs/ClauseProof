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
        'rounded-xl p-6 bg-white border border-[#E4E2D8] shadow-[0_1px_0_rgba(22,35,61,0.03)] transition-colors duration-200 text-[#16233D] hover:bg-[#FAFAF7]/60',
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#E4E2D8]">
          <div>
            {title && (
              <h3 className="font-heading text-lg font-bold text-[#16233D] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-sans text-xs text-[#4A5568] mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2.5">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
