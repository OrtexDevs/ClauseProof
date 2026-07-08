import React from 'react';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'pass' | 'fail' | 'warning' | 'info' | 'draft' | 'primary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'draft', 
  children, 
  className,
  icon 
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    pass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    fail: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    draft: 'bg-[#EFE9E3] text-[#78716c] border-[#D9CFC7]',
    primary: 'bg-[#EFE9E3] text-[#8c7a65] border-[#C9B59C] shadow-sm',
  };

  return (
    <span className={twMerge(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide transition-all duration-200',
      variantStyles[variant],
      className
    )}>
      {icon && <span className="w-3 h-3 flex items-center justify-center">{icon}</span>}
      {children}
    </span>
  );
};
