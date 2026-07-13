import React from 'react';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'pass' | 'fail' | 'warning' | 'info' | 'draft' | 'primary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const styles: Record<BadgeVariant, string> = {
  pass:    'bg-[#086F83]/12 text-[#086F83] border-[#086F83]/40 font-bold',
  fail:    'bg-[#C2590E]/12 text-[#C2590E] border-[#C2590E]/40 font-bold',
  warning: 'bg-[#C2590E]/12 text-[#C2590E] border-[#C2590E]/40 font-bold',
  info:    'bg-[#0B8CA5]/12 text-[#0B8CA5] border-[#0B8CA5]/40 font-bold',
  draft:   'bg-[#EEF0EB] text-[#25314C] border-[#DCE0D6] font-bold',
  primary: 'bg-[#0B1120] text-white border-[#0B1120] font-bold shadow-subtle',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'draft', children, className, icon }) => (
  <span className={twMerge(
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs uppercase tracking-wider border shadow-subtle transition-all duration-200',
    styles[variant],
    className
  )}>
    {icon && <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">{icon}</span>}
    {children}
  </span>
);
