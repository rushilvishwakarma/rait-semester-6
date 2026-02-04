import { RootProvider } from 'fumadocs-ui/provider/next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './global.css';
import 'katex/dist/katex.css';
import localFont from 'next/font/local';

const ppMori = localFont({
  src: [
    {
      path: '../public/fonts/PPMori-Extralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPMori-ExtralightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../public/fonts/PPMori-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPMori-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/PPMori-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPMori-SemiboldItalic.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../public/fonts/PPMori-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPMori-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-pp-mori',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={ppMori.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
