import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { FloatingColabButton } from '@/components/ui/floating-colab-button';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Mermaid } from '@/components/mermaid';

import { CustomCallout } from '@/components/custom-callout';

import { CuratedResources } from '@/components/curated-videos';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Callout: CustomCallout,
    FloatingColabButton,
    Mermaid,
    CuratedResources,
    CuratedVideos: CuratedResources,
    img: (props) => <ImageZoom {...(props as any)} />,
    ...components,
  };
}
