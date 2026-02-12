'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { MonitorPlay, MonitorOff, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

// --- Context ---

const STORAGE_KEY = 'curated-resources-visible';

interface CuratedResourcesContextType {
  visible: boolean;
  toggle: () => void;
}

const CuratedResourcesContext = createContext<CuratedResourcesContextType>({
  visible: true,
  toggle: () => {},
});

export function useCuratedResources() {
  return useContext(CuratedResourcesContext);
}

// --- Provider ---

export function CuratedResourcesProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setVisible(stored === 'true');
    }
  }, []);

  const toggle = () => {
    setVisible((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <CuratedResourcesContext.Provider value={{ visible, toggle }}>
      {children}
    </CuratedResourcesContext.Provider>
  );
}

// --- Sidebar Toggle ---

export function CuratedResourcesToggle({ className }: { className?: string }) {
  const { visible, toggle } = useCuratedResources();

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-full p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
      aria-label={visible ? 'Hide curated resources' : 'Show curated resources'}
      title={visible ? 'Hide curated resources' : 'Show curated resources'}
      onClick={toggle}
    >
      {visible ? (
        <MonitorPlay className="size-4.5" />
      ) : (
        <MonitorOff className="size-4.5" />
      )}
    </button>
  );
}

// --- Visibility Wrapper ---

export function CuratedResourcesWrapper({ children }: { children: ReactNode }) {
  const { visible } = useCuratedResources();

  if (!visible) return null;

  return <>{children}</>;
}

// --- Carousel Next Button ---

export function CarouselNav({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const viewport = containerRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement | null;
    if (!viewport) return;
    setCanScrollLeft(viewport.scrollLeft > 4);
    setCanScrollRight(
      viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const viewport = containerRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement | null;
    if (!viewport) return;

    checkScroll();
    viewport.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(viewport);
    return () => {
      viewport.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scrollPrev = () => {
    const viewport = containerRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement | null;
    if (!viewport) return;
    viewport.scrollBy({ left: -420, behavior: 'smooth' });
  };

  const scrollNext = () => {
    const viewport = containerRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement | null;
    if (!viewport) return;
    viewport.scrollBy({ left: 420, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative">
      {children}
      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border shadow-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={scrollNext}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border shadow-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}
