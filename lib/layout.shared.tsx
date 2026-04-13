import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { QuestionDotLegend } from '@/components/question-dot-legend';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <Image
            src="/logos/brand/logo-in-dark-mode.svg"
            alt="Logo"
            width={110}
            height={60}
            className="dark:hidden"
          />
          <Image
            src="/logos/brand/logo-in-light-mode.svg"
            alt="Logo"
            width={110}
            height={60}
            className="hidden dark:block"
          />
        </div>
      ),
    },
    links: [
      {
        type: 'icon',
        label: 'Question Markers',
        icon: <QuestionDotLegend />,
        text: 'Question Markers',
        url: '#',
      },
      {
        type: 'icon',
        label: 'Upload Notes',
        icon: <Upload />,
        text: 'Upload',
        url: '/upload',
      },
    ],
  };
}
