import { RootProvider } from 'fumadocs-ui/provider/next';
import { Banner } from 'fumadocs-ui/components/banner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CuratedResourcesProvider } from '@/components/curated-videos-client';
import { TooltipProvider } from '@/components/ui/tooltip';
import './global.css';
import 'katex/dist/katex.css';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://raitsem6.vercel.app'),
  icons: [
    {
      url: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      url: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
};

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
            <TooltipProvider>
              <Banner
                variant="rainbow"
                rainbowColors={[
                  '#ec8e8e6e',
                  '#ff4f6f33',
                  '#7d112e3f',
                  '#2b00147f',
                ]}
              >
                ESE begin 27 April 2026. <a href="/docs/core/academic-calendars/ese-timetable" className="underline font-semibold ml-1">View Timetable</a>
              </Banner>
              {children}
            </TooltipProvider>
          </RootProvider>
        </CuratedResourcesProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
