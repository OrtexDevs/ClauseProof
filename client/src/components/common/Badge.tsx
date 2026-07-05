import React from 'react';
import { clsx } from 'clsx';
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
    pass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    fail: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    draft: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
    primary: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-glow',
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
