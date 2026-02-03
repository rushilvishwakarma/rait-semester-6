import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

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
  };
}
