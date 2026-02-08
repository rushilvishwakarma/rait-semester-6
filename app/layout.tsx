import { RootProvider } from 'fumadocs-ui/provider/next';
import { Banner } from 'fumadocs-ui/components/banner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CuratedResourcesProvider } from '@/components/curated-videos-client';
import './global.css';
import 'katex/dist/katex.css';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

const googleSans = localFont({
  src: [
    {
      path: '../public/fonts/GoogleSans-VariableFont_GRAD,opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: '../public/fonts/GoogleSans-Italic-VariableFont_GRAD,opsz,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-google-sans',
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={googleSans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <CuratedResourcesProvider>
        <RootProvider>
          <Banner
            variant="rainbow"
            rainbowColors={[
              '#ec8e8e6e',
              '#ff4f6f33',
              '#7d112e3f',
              '#2b00147f',
            ]}
          >
            IA1 Exams begin 16th Feb 2026. <a href="/docs/core/internal-assessment-1" className="underline font-semibold ml-1">View Timetable</a>
          </Banner>
          {children}
        </RootProvider>
        </CuratedResourcesProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
