'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;

      const { default: mermaid } = await import('mermaid');

      // Detect dark mode
      const isDark = document.documentElement.classList.contains('dark');

      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        themeVariables: isDark
          ? {
              // Dark theme - neutral colors matching page
              primaryColor: '#404040',
              primaryTextColor: '#e5e5e5',
              primaryBorderColor: '#525252',
              lineColor: '#737373',
              secondaryColor: '#262626',
              tertiaryColor: '#171717',
              background: '#0a0a0a',
              mainBkg: '#171717',
              nodeBorder: '#404040',
              clusterBkg: '#171717',
              clusterBorder: '#404040',
              titleColor: '#e5e5e5',
              edgeLabelBackground: '#171717',
              nodeTextColor: '#e5e5e5',
            }
          : {
              // Light theme - neutral colors
              primaryColor: '#e5e5e5',
              primaryTextColor: '#171717',
              primaryBorderColor: '#d4d4d4',
              lineColor: '#a3a3a3',
              secondaryColor: '#f5f5f5',
              tertiaryColor: '#fafafa',
              background: '#ffffff',
              mainBkg: '#fafafa',
              nodeBorder: '#d4d4d4',
              clusterBkg: '#f5f5f5',
              clusterBorder: '#d4d4d4',
              titleColor: '#171717',
              edgeLabelBackground: '#fafafa',
              nodeTextColor: '#171717',
            },
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          rankSpacing: 50,
          nodeSpacing: 30,
          padding: 15,
          useMaxWidth: true,
        },
      });

      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
      try {
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    };

    renderChart();

    // Re-render on theme change
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          renderChart();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-xl border bg-fd-card p-4 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

