'use client';

import { GrainGradient } from '@paper-design/shaders-react';

export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <GrainGradient
        style={{ width: '100%', height: '150%' }}
        colors={['#ff3d3de0', '#ffa8d5', '#a01c35', '#57000e']}
        colorBack="#000000"
        softness={0.5}
        intensity={0.5}
        noise={0.25}
        shape="corners"
        speed={1}
        minPixelRatio={2}
        maxPixelCount={900000}
      />
    </div>
  );
}
