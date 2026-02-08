'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { MonitorPlay, MonitorOff, Search } from 'lucide-react';
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
