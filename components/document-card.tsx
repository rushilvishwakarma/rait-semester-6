'use client';

import { ReactNode } from 'react';
import { Card } from 'fumadocs-ui/components/card';
import { FileText } from 'lucide-react';

export function DocumentCard({
  title,
  href,
  children
}: {
  title: string;
  href: string;
  children?: ReactNode;
}) {
  const handleCardClick = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      return;
    }
    handleCardClick();
  };

  return (
    <Card
      icon={<FileText />}
      title={title}
      className="cursor-pointer hover:bg-fd-accent/80 transition-colors"        
      onClick={handleContainerClick}
    >
      <div className="text-sm text-fd-muted-foreground prose-no-margin empty:hidden">
        {children || "View Document"}
      </div>
    </Card>
  );
}
