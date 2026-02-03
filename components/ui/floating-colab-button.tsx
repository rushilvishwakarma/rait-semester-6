'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface FloatingColabButtonProps {
    className?: string;
    colabLink?: string;
}

export function FloatingColabButton({ className, colabLink }: FloatingColabButtonProps) {
    return (
        <motion.a
            href={colabLink || "https://colab.research.google.com/#create=true"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'fixed bottom-6 right-6 z-50 rounded-full shadow-lg inline-flex items-center gap-2 h-9 px-3 py-1.5 hover:no-underline no-underline',
                className
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Image
                src="/logos/Google_Colaboratory.svg"
                alt="Google Colab"
                width={20}
                height={20}
                className="rounded-sm"
            />
            <span>Open Colab</span>
            <ExternalLink size={10} />
        </motion.a>
    );
}
