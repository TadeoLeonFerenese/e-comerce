import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  primary:
    'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
  secondary:
    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  success:
    'bg-emerald-100 text-[#16a34a] border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
  danger:
    'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800',
  warning:
    'bg-orange-100 text-[#f97316] border-orange-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'secondary',
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border h-fit ${BADGE_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
