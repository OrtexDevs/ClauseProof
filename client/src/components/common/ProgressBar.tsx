import React from 'react';
import { twMerge } from 'tailwind-merge';

export type ProgressVariant = 'pass' | 'warning' | 'fail' | 'auto' | 'primary';

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  variant?: ProgressVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showValue = true,
  variant = 'auto',
  size = 'md',
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  let colorClass = 'bg-[#0B1120]';
  if (variant === 'pass' || (variant === 'auto' && clamped >= 80)) {
    colorClass = 'bg-[#086F83]';
  } else if (variant === 'warning' || (variant === 'auto' && clamped >= 50)) {
    colorClass = 'bg-[#0B8CA5]';
  } else if (variant === 'fail' || (variant === 'auto' && clamped < 50)) {
    colorClass = 'bg-[#C2590E]';
  }

  const heights = { sm: 'h-2', md: 'h-2.5', lg: 'h-3.5' };

  return (
    <div className={twMerge('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs mb-2 font-mono font-bold">
          {label && <span className="text-[#25314C]">{label}</span>}
          {showValue && <span className="font-extrabold text-[#0B1120]">{clamped}%</span>}
        </div>
      )}
      <div className={twMerge('w-full bg-[#EEF0EB] rounded-full overflow-hidden border border-[#DCE0D6] shadow-inner', heights[size])}>
        <div
          className={twMerge('h-full rounded-full transition-all duration-500 ease-out shadow-subtle', colorClass)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
