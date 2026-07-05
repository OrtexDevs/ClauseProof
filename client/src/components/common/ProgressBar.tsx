import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'auto' | 'success' | 'warning' | 'danger' | 'primary';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  variant = 'auto',
  className,
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  let barColorClass = 'from-indigo-500 via-purple-500 to-pink-500';
  if (variant === 'auto') {
    if (percentage >= 70) barColorClass = 'from-emerald-500 to-teal-400 shadow-emerald-500/20';
    else if (percentage >= 40) barColorClass = 'from-amber-500 to-yellow-400 shadow-amber-500/20';
    else barColorClass = 'from-rose-500 to-red-400 shadow-rose-500/20';
  } else if (variant === 'success') {
    barColorClass = 'from-emerald-500 to-teal-400';
  } else if (variant === 'warning') {
    barColorClass = 'from-amber-500 to-yellow-400';
  } else if (variant === 'danger') {
    barColorClass = 'from-rose-500 to-red-400';
  }

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={twMerge('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium">
          {label && <span className="text-slate-300">{label}</span>}
          {showValue && <span className="text-slate-400 font-mono">{percentage}%</span>}
        </div>
      )}
      <div className={twMerge('w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5', sizeStyles[size])}>
        <div
          className={twMerge('h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out shadow-sm', barColorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
