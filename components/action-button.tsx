'use client';
import { cn } from '@/lib/cn';
import { buttonVariants } from './ui/button';
import { FileText, FileDown, FileCode, type LucideIcon } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
    pdf: FileDown,
    docx: FileText,
    source: FileCode,
};

interface ActionButtonProps {
    href: string;
    label: string;
    icon?: 'pdf' | 'docx' | 'source';
}

export function ActionButton({ href, label, icon }: ActionButtonProps) {
    const Icon = icon ? icons[icon] : null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                buttonVariants({
                    color: 'secondary',
                    size: 'sm',
                    className: 'gap-2 text-xs',
                }),
                'no-underline'
            )}
        >
            {Icon && <Icon className="size-3.5" />}
            {label}
        </a>
    );
}
