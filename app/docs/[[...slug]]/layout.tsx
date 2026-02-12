import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { BookOpen, FlaskConical } from 'lucide-react';
import { CuratedResourcesToggle } from '@/components/curated-videos-client';
import { ThemeToggle } from 'fumadocs-ui/components/layout/theme-toggle';

export default async function Layout(props: {
    children: ReactNode;
    params: Promise<{ slug?: string[] }>;
}) {
    const params = await props.params;
    const slug = params.slug;

    // If we're at the root /docs (no slug), render an empty sidebar
    const isRoot = !slug || slug.length === 0;

    // Find the subdirectory for the current mode when not root
    const root = source.pageTree;
    let tree = root;

    if (!isRoot) {
        const mode = slug[0] === 'labs' ? 'labs' : 'core';

        // Try to find the folder node (check both lowercase and title case)
        const modeNode = root.children.find((node) =>
            node.type === 'folder' && 
            typeof node.name === 'string' &&
            (node.name.toLowerCase() === mode || (node.$ref?.metaFile && node.$ref.metaFile.includes(`/${mode}/`)))
        );

        if (modeNode && modeNode.type === 'folder') {
            // Create a virtual root with the children of the mode folder
            tree = {
                ...root,
                children: modeNode.children
            };
        }
    } else {
        // For the root docs page, hide the sidebar entries
        tree = { ...root, children: [] };
    }

    const sidebarProp = isRoot
        ? { tabs: [] }
        : {
              tabs: [
                  {
                      title: 'Core',
                      url: '/docs/core',
                      icon: <div className="size-full flex items-center justify-center"><BookOpen className="size-5" /></div>,
                  },
                  {
                      title: 'Labs',
                      url: '/docs/labs',
                      icon: <div className="size-full flex items-center justify-center"><FlaskConical className="size-5" /></div>,
                  },
              ],
          };

    return (
        <DocsLayout tree={tree} {...baseOptions()} sidebar={sidebarProp} themeSwitch={{ component: <div className="flex items-center gap-0.5 ms-auto"><CuratedResourcesToggle /><ThemeToggle className="p-0" /></div> }}>
            {props.children}
        </DocsLayout>
    );
}
