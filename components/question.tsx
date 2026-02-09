import type { ReactNode, CSSProperties } from 'react';

interface QuestionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Wraps a question heading + its answer content inside a squircle callout border.
 * Use this when you want the callout to span multiple lines / include answer content,
 * or when you need per-question style overrides.
 *
 * Usage in MDX:
 *   <Question>
 *   ### Q7. Some long question here
 *   Answer content, tables, math, etc.
 *   </Question>
 *
 * Override styles:
 *   <Question style={{ borderColor: 'blue' }}>
 */
export function LongQuestion({ children, className, style }: QuestionProps) {
  return (
    <div
      data-question
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
