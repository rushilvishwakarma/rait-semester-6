import React from 'react';
import { cn } from '@/lib/cn';

export type HighlightColor =
  | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
  | 'pink' | 'rose';

interface HighlightProps {
  children: React.ReactNode;
  color?: HighlightColor;
  className?: string;
}

export function Highlight({ children, color = 'yellow', className }: HighlightProps) {
  const colorClasses: Record<HighlightColor, string> = {
    slate: 'bg-slate-200 dark:bg-slate-500/30 text-gray-900 dark:text-slate-50',
    gray: 'bg-gray-200 dark:bg-gray-500/30 text-gray-900 dark:text-gray-50',
    zinc: 'bg-zinc-200 dark:bg-zinc-500/30 text-gray-900 dark:text-zinc-50',
    neutral: 'bg-neutral-200 dark:bg-neutral-500/30 text-gray-900 dark:text-neutral-50',
    stone: 'bg-stone-200 dark:bg-stone-500/30 text-gray-900 dark:text-stone-50',
    red: 'bg-red-200 dark:bg-red-500/30 text-gray-900 dark:text-red-50',
    orange: 'bg-orange-200 dark:bg-orange-500/30 text-gray-900 dark:text-orange-50',
    amber: 'bg-amber-200 dark:bg-amber-500/30 text-gray-900 dark:text-amber-50',
    yellow: 'bg-yellow-200 dark:bg-yellow-500/30 text-gray-900 dark:text-yellow-50',
    lime: 'bg-lime-200 dark:bg-lime-500/30 text-gray-900 dark:text-lime-50',
    green: 'bg-green-200 dark:bg-green-500/30 text-gray-900 dark:text-green-50',
    emerald: 'bg-emerald-200 dark:bg-emerald-500/30 text-gray-900 dark:text-emerald-50',
    teal: 'bg-teal-200 dark:bg-teal-500/30 text-gray-900 dark:text-teal-50',
    cyan: 'bg-cyan-200 dark:bg-cyan-500/30 text-gray-900 dark:text-cyan-50',
    sky: 'bg-sky-200 dark:bg-sky-500/30 text-gray-900 dark:text-sky-50',
    blue: 'bg-blue-200 dark:bg-blue-500/30 text-gray-900 dark:text-blue-50',
    indigo: 'bg-indigo-200 dark:bg-indigo-500/30 text-gray-900 dark:text-indigo-50',
    violet: 'bg-violet-200 dark:bg-violet-500/30 text-gray-900 dark:text-violet-50',
    purple: 'bg-purple-200 dark:bg-purple-500/30 text-gray-900 dark:text-purple-50',
    fuchsia: 'bg-fuchsia-200 dark:bg-fuchsia-500/30 text-gray-900 dark:text-fuchsia-50',
    pink: 'bg-pink-200 dark:bg-pink-500/30 text-gray-900 dark:text-pink-50',
    rose: 'bg-rose-200 dark:bg-rose-500/30 text-gray-900 dark:text-rose-50',
  };

  return (
    <mark className={cn(colorClasses[color], 'px-1 rounded', className)}>
      {children}
    </mark>
  );
}
