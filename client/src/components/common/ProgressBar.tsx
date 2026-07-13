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

  let colorClass = 'bg-[#16233D]';
  if (variant === 'pass' || (variant === 'auto' && clamped >= 80)) {
    colorClass = 'bg-[#2E7D8C]';
  } else if (variant === 'warning' || (variant === 'auto' && clamped >= 50)) {
    colorClass = 'bg-[#39A0B0]';
  } else if (variant === 'fail' || (variant === 'auto' && clamped < 50)) {
    colorClass = 'bg-[#C9762E]';
  }

  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  return (
    <div className={twMerge('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs mb-2 font-mono">
          {label && <span className="text-[#4A5568]">{label}</span>}
          {showValue && <span className="font-semibold text-[#16233D]">{clamped}%</span>}
        </div>
      )}
      <div className={twMerge('w-full bg-[#FAFAF7] rounded-full overflow-hidden border border-[#E4E2D8]', heights[size])}>
        <div
          className={twMerge('h-full rounded-full transition-all duration-500 ease-out', colorClass)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
