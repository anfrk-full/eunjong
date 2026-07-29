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

/** true면 페이지 전환을 막고 소비한 것으로 처리 */
export type WheelConsumer = (delta: number) => boolean;

interface PageContextValue {
  index: number;
  pageId: PageId;
  pageCount: number;
  goTo: (target: PageId | number) => void;
  next: () => void;
  prev: () => void;
  locked: boolean;
  setLocked: (locked: boolean) => void;
  setWheelConsumer: (consumer: WheelConsumer | null) => void;
}

const PageContext = createContext<PageContextValue | null>(null);

const WHEEL_COOLDOWN_MS = 700;
const SWIPE_THRESHOLD = 50;

const SCROLL_Y_SELECTOR =
  '[data-scroll-y], .modal, .wl__detail-scroll, .lightbox-overlay, .skills__expand';

function isScrollableY(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  const canOverflow =
    overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
  return canOverflow && el.scrollHeight > el.clientHeight + 1;
}

/** 휠 이벤트 타깃에서 실제로 세로 스크롤 가능한 조상 찾기 */
function findVerticalScroller(start: HTMLElement | null): HTMLElement | null {
  if (!start) return null;

  const marked = start.closest(SCROLL_Y_SELECTOR) as HTMLElement | null;
  if (marked) {
    if (isScrollableY(marked)) return marked;
    const nested = marked.querySelector<HTMLElement>(
      '[data-scroll-y], .modal, .wl__detail-scroll'
    );
    if (nested && isScrollableY(nested)) return nested;
    if (marked.scrollHeight >= marked.clientHeight) return marked;
  }

  let el: HTMLElement | null = start;
  while (el && el !== document.body && el !== document.documentElement) {
    if (isScrollableY(el)) return el;
    el = el.parentElement;
  }
  return null;
}

function canScrollY(el: HTMLElement, deltaY: number): boolean {
  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollHeight <= clientHeight + 1) return false;
  if (deltaY > 0) return scrollTop + clientHeight < scrollHeight - 1;
  if (deltaY < 0) return scrollTop > 1;
  return false;
}

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const cooldown = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const wheelConsumer = useRef<WheelConsumer | null>(null);
  const lockedRef = useRef(locked);

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  const setWheelConsumer = useCallback((consumer: WheelConsumer | null) => {
    wheelConsumer.current = consumer;
  }, []);

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
      const target = e.target as HTMLElement | null;
      const scroller = findVerticalScroller(target);
      const deltaY = e.deltaY;
      const deltaX = e.deltaX;
      const dominantDelta =
        Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;

      // 상세/모달 등 세로 스크롤 영역: 페이지 전환 대신 내부 스크롤 우선
      if (scroller && Math.abs(deltaY) >= Math.abs(deltaX)) {
        if (lockedRef.current || canScrollY(scroller, deltaY)) {
          return;
        }
      }

      if (lockedRef.current) {
        e.preventDefault();
        return;
      }

      if (Math.abs(deltaY) < 8 && Math.abs(deltaX) < 8) return;
      e.preventDefault();
      if (cooldown.current) return;
      if (dominantDelta === 0) return;

      if (wheelConsumer.current?.(dominantDelta)) return;

      if (dominantDelta > 0) {
        setIndex((i) => Math.min(i + 1, pageCount - 1));
      } else {
        setIndex((i) => Math.max(i - 1, 0));
      }
      bumpCooldown();
    };

    const onKey = (e: KeyboardEvent) => {
      if (lockedRef.current) return;
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
      if (lockedRef.current || !touchStart.current) return;
      const target = e.target as HTMLElement | null;
      if (findVerticalScroller(target)) {
        touchStart.current = null;
        return;
      }
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
  }, [pageCount, bumpCooldown]);

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
      setWheelConsumer,
    }),
    [index, pageId, pageCount, goTo, next, prev, locked, setWheelConsumer]
  );

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

export function usePage(): PageContextValue {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error('usePage must be used within PageProvider');
  return ctx;
}
