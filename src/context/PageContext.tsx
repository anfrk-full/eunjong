import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export const PAGE_IDS = [
  'hero',
  'about',
  'skills',
  'education',
  'experience',
  'projects',
  'worklog',
] as const;

export type PageId = (typeof PAGE_IDS)[number];

export const PAGE_LABELS: Record<PageId, string> = {
  hero: 'Home',
  about: 'About',
  skills: 'Skills',
  education: 'Education',
  experience: 'Experience',
  projects: 'Projects',
  worklog: 'Work Log',
};

interface PageContextValue {
  index: number;
  pageId: PageId;
  pageCount: number;
  goTo: (target: PageId | number) => void;
  next: () => void;
  prev: () => void;
  locked: boolean;
  setLocked: (locked: boolean) => void;
}

const PageContext = createContext<PageContextValue | null>(null);

const WHEEL_COOLDOWN_MS = 700;
const SWIPE_THRESHOLD = 50;

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const cooldown = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const pageCount = PAGE_IDS.length;
  const pageId = PAGE_IDS[index];

  const goTo = useCallback((target: PageId | number) => {
    const nextIndex =
      typeof target === 'number' ? target : PAGE_IDS.indexOf(target);
    if (nextIndex < 0 || nextIndex >= PAGE_IDS.length) return;
    setIndex(nextIndex);
  }, []);

  const next = useCallback(() => {
    if (locked || cooldown.current) return;
    setIndex((i) => Math.min(i + 1, pageCount - 1));
  }, [locked, pageCount]);

  const prev = useCallback(() => {
    if (locked || cooldown.current) return;
    setIndex((i) => Math.max(i - 1, 0));
  }, [locked]);

  const bumpCooldown = useCallback(() => {
    cooldown.current = true;
    window.setTimeout(() => {
      cooldown.current = false;
    }, WHEEL_COOLDOWN_MS);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (locked) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('.modal-overlay, .wl__detail-scroll, .lightbox-overlay')) {
        return;
      }
      if (Math.abs(e.deltaY) < 8 && Math.abs(e.deltaX) < 8) return;
      e.preventDefault();
      if (cooldown.current) return;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta > 0) {
        setIndex((i) => Math.min(i + 1, pageCount - 1));
      } else if (delta < 0) {
        setIndex((i) => Math.max(i - 1, 0));
      }
      bumpCooldown();
    };

    const onKey = (e: KeyboardEvent) => {
      if (locked) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, pageCount - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setIndex(pageCount - 1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (locked || !touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      touchStart.current = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) setIndex((i) => Math.min(i + 1, pageCount - 1));
      else setIndex((i) => Math.max(i - 1, 0));
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [locked, pageCount, bumpCooldown]);

  const value = useMemo(
    () => ({
      index,
      pageId,
      pageCount,
      goTo,
      next,
      prev,
      locked,
      setLocked,
    }),
    [index, pageId, pageCount, goTo, next, prev, locked]
  );

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

export function usePage(): PageContextValue {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error('usePage must be used within PageProvider');
  return ctx;
}
