'use client';

import { useEffect, useRef, useState } from 'react';

function YouTubeIcon() {
    return (
        // Simplified Simple Icons-like glyph: rounded rect + play triangle, monochrome
        <svg viewBox="0 0 24 24" className="size-3.5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <rect x="1.5" y="5" width="21" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" />
        </svg>
    );
}

function findNearestHeading(startEl: Element): string | null {
    // Strategy: walk up to find the outermost wrapper that's inside the article/prose,
    // then walk its previous siblings looking for headings.

    // First, try walking up to find a direct child of the prose/article container
    let container = startEl;
    let parent = container.parentElement;

    // Walk up until we find a parent that is the article or prose wrapper
    while (parent) {
        if (
            parent.tagName === 'ARTICLE' ||
            parent.classList.contains('prose') ||
            parent.hasAttribute('data-mdx-content') ||
            parent.id === 'nd-page'
        ) {
            break;
        }
        container = parent;
        parent = parent.parentElement;
    }

    // Now walk previous siblings of `container` looking for a heading
    let sibling: Element | null = container.previousElementSibling;
    while (sibling) {
        // Check the sibling itself or any heading inside it
        const heading = sibling.matches('h1, h2, h3, h4, h5, h6')
            ? sibling
            : sibling.querySelector('h1, h2, h3, h4, h5, h6');

        if (heading) {
            return heading.textContent?.trim() || null;
        }
        sibling = sibling.previousElementSibling;
    }

    // Fallback: find any heading on the page before this element in document order
    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastHeading: Element | null = null;
    for (const h of allHeadings) {
        // Check if this heading comes before our start element
        if (startEl.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_PRECEDING) {
            lastHeading = h;
        }
    }

    return lastHeading?.textContent?.trim() || null;
}

export function YouTubeSearchButton() {
    const ref = useRef<HTMLAnchorElement>(null);
    const [searchUrl, setSearchUrl] = useState<string>('');

    useEffect(() => {
        if (!ref.current) return;

        const headingText = findNearestHeading(ref.current);

        if (headingText) {
            // Clean up: remove Q1./Q2. prefix, LECTURE X: prefix, trim
            const cleaned = headingText
                .replace(/^Q\d+\.\s*/i, '')
                .replace(/^lecture\s+\d+\s*:\s*/i, '')
                .trim();
            setSearchUrl(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(cleaned)}`
            );
        } else {
            // Fallback: use the page title
            const title = document.title.replace(/\s*[|–-]\s*.+$/, '').trim();
            setSearchUrl(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`
            );
        }
    }, []);

    return (
        <a
            ref={ref}
            href={searchUrl || 'https://www.youtube.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border bg-fd-muted px-3 py-1.5 text-xs font-medium text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
        >
            <YouTubeIcon />
            <span>YouTube</span>
        </a>
    );
}
