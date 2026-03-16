import { cn } from '@/lib/utils';
import { AnchorHTMLAttributes } from 'react';

export function AuthorLink({ className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-foreground font-medium underline decoration-fd-primary underline-offset-4 hover:text-fd-primary transition-colors relative z-20 cursor-pointer",
        className
      )}
    >
      {children}
    </a>
  );
}
