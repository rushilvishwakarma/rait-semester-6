import React from 'react';

interface HighlightProps {
  children: React.ReactNode;
  color?: 'yellow' | 'blue' | 'green' | 'orange';
}

export function Highlight({ children, color = 'yellow' }: HighlightProps) {
  const colorClasses = {
    yellow: 'bg-yellow-200 dark:bg-yellow-500/30 text-gray-900 dark:text-yellow-50',
    blue: 'bg-blue-200 dark:bg-blue-500/40 text-gray-900 dark:text-blue-50',
    green: 'bg-green-200 dark:bg-green-500/30 text-gray-900 dark:text-green-50',
    orange: 'bg-orange-200 dark:bg-orange-500/30 text-gray-900 dark:text-orange-50',
  };

  return (
    <mark className={`${colorClasses[color]} px-1 rounded`}>
      {children}
    </mark>
  );
}
