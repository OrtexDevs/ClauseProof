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
  pass:    'bg-[#2E7D8C]/10 text-[#2E7D8C] border-[#2E7D8C]/30',
  fail:    'bg-[#C9762E]/10 text-[#C9762E] border-[#C9762E]/30',
  warning: 'bg-[#C9762E]/10 text-[#C9762E] border-[#C9762E]/30',
  info:    'bg-[#39A0B0]/10 text-[#39A0B0] border-[#39A0B0]/30',
  draft:   'bg-[#F5F5F0] text-[#4A5568] border-[#E4E2D8]',
  primary: 'bg-[#16233D] text-white border-[#16233D]',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'draft', children, className, icon }) => (
  <span className={twMerge(
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-[11px] font-medium uppercase tracking-wider border',
    styles[variant],
    className
  )}>
    {icon && <span className="w-3 h-3 flex items-center justify-center shrink-0">{icon}</span>}
    {children}
  </span>
);
