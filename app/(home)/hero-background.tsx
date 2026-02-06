'use client';

import { GrainGradient } from '@paper-design/shaders-react';
import { useEffect, useState } from 'react';

export function HeroBackground() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 -z-10 border border-muted-foreground rounded-2xl overflow-hidden">
      <GrainGradient
        style={{ width: '100%', height: '100%' }}
        colors={['#ff3d3d3e', '#ff4f6f69', '#a01c35', '#2b0007']}
        colorBack={isDark ? '#121212' : '#F1F1F1'}
        softness={0.5}
        intensity={0.5}
        noise={0.25}
        shape="corners"
        speed={1}
        scale={2}
        minPixelRatio={2}
        maxPixelCount={900000}
      />
    </div>
  );
}
