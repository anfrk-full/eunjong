import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePage } from '../context/PageContext';

const MAGNET_STRENGTH = 0.28;
const MAGNET_MAX = 20;
const DROP_COUNT = 120;
const UMBRELLA_W = 72;
const UMBRELLA_H = 28;

type Drop = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  width: number;
  alpha: number;
  /** 0 far 쨌 1 mid 쨌 2 near */
  layer: 0 | 1 | 2;
};

type Splash = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
};

const MagneticButton: React.FC<{
  children: React.ReactNode;
  enabled: boolean;
}> = ({ children, enabled }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled || e.pointerType === 'touch' || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      setOffset({
        x: Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, dx * MAGNET_STRENGTH)),
        y: Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, dy * MAGNET_STRENGTH)),
      });
    },
    [enabled]
  );

  const onLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className="hero__magnet"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    >
      {children}
    </div>
  );
};

function spawnDrop(w: number, h: number, fromTop = true): Drop {
  const roll = Math.random();
  const layer: 0 | 1 | 2 = roll < 0.4 ? 0 : roll < 0.75 ? 1 : 2;

  const layerScale = layer === 0 ? 0.7 : layer === 1 ? 1.05 : 1.45;
  const wind = -0.25 - Math.random() * 0.55;
  const fall = (3.4 + Math.random() * 3) * layerScale;

  return {
    x: Math.random() * (w + 80) - 40,
    y: fromTop ? -Math.random() * h * 0.55 : Math.random() * h,
    vx: wind * layerScale,
    vy: fall,
    len: (14 + Math.random() * 22) * layerScale,
    width: (1.2 + Math.random() * 1.4) * (layer === 2 ? 1.5 : layer === 1 ? 1.15 : 0.85),
    alpha: (0.32 + Math.random() * 0.28) * (layer === 2 ? 1.4 : layer === 1 ? 1.1 : 0.8),
    layer,
  };
}

function rainRgba(light: boolean, alpha: number) {
  return light
    ? `rgba(59, 110, 210, ${alpha})`
    : `rgba(198, 220, 255, ${alpha})`;
}

const RainScene: React.FC<{ enabled: boolean; active: boolean }> = ({
  enabled,
  active,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, inside: false });
  const drops = useRef<Drop[]>([]);
  const splashes = useRef<Splash[]>([]);
  const raf = useRef<number>(0);
  const size = useRef({ w: 0, h: 0 });
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prev = size.current;
      const next = { w: rect.width, h: rect.height };
      size.current = next;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 최초 진입/크기 변경이 클 때만 빗방울 재생성 — 우산 on/off로는 리셋하지 않음
      const needsRespawn =
        drops.current.length === 0 ||
        Math.abs(prev.w - next.w) > 1 ||
        Math.abs(prev.h - next.h) > 1;
      if (needsRespawn) {
        drops.current = Array.from({ length: DROP_COUNT }, () =>
          spawnDrop(rect.width, rect.height, false)
        );
        splashes.current = [];
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const isLight = () =>
      document.documentElement.getAttribute('data-theme') === 'light';

    const hitUmbrella = (d: Drop) => {
      if (!pointer.current.inside || !activeRef.current) return false;
      const ux = pointer.current.x;
      const uy = pointer.current.y;
      const cx = ux;
      const cy = uy + 8;
      const dx = d.x - cx;
      const dy = d.y - cy;
      const nx = dx / (UMBRELLA_W * 0.5);
      const ny = dy / (UMBRELLA_H * 0.55);
      return nx * nx + ny * ny <= 1 && dy >= -UMBRELLA_H * 0.35;
    };

    const shatter = (d: Drop, w: number, h: number) => {
      const ux = pointer.current.x;
      const hitX = d.x;
      const hitY = d.y;
      const baseSide = hitX < ux ? -1 : 1;
      const count = 7 + Math.floor(Math.random() * 5);

      for (let i = 0; i < count; i++) {
        const angle = -Math.PI * 0.15 + Math.random() * Math.PI * 1.3;
        const speed = 1.6 + Math.random() * 3.4;
        const outward = baseSide * (0.6 + Math.random() * 1.8);
        splashes.current.push({
          x: hitX + (Math.random() - 0.5) * 6,
          y: hitY + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed * 0.35 + outward + (Math.random() - 0.5) * 1.2,
          vy: -Math.abs(Math.sin(angle) * speed) - 0.8 - Math.random() * 2.4,
          life: 0.55 + Math.random() * 0.45,
          r: 1.2 + Math.random() * 2.4,
        });
      }

      Object.assign(d, spawnDrop(w, h, true));
    };

    const drawDrop = (d: Drop, light: boolean) => {
      const speed = Math.hypot(d.vx, d.vy) || 1;
      const ux = d.vx / speed;
      const uy = d.vy / speed;

      const headX = d.x;
      const headY = d.y;
      const tailX = d.x - ux * d.len;
      const tailY = d.y - uy * d.len;

      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      grad.addColorStop(0, rainRgba(light, 0));
      grad.addColorStop(0.45, rainRgba(light, d.alpha * 0.55));
      grad.addColorStop(0.82, rainRgba(light, d.alpha));
      grad.addColorStop(1, rainRgba(light, Math.min(1, d.alpha * 1.25)));

      ctx.strokeStyle = grad;
      ctx.lineWidth = d.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      if (d.layer >= 1) {
        ctx.fillStyle = rainRgba(light, d.alpha * 0.9);
        ctx.beginPath();
        ctx.arc(headX, headY, Math.max(1.2, d.width * 0.7), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);

      const light = isLight();
      const splashColor = light ? 'rgba(59, 110, 210, 0.55)' : 'rgba(210, 228, 255, 0.62)';

      for (let layer = 0; layer <= 2; layer++) {
        for (const d of drops.current) {
          if (d.layer !== layer) continue;

          if (hitUmbrella(d)) {
            shatter(d, w, h);
            continue;
          }

          d.x += d.vx;
          d.y += d.vy;
          drawDrop(d, light);

          if (d.y > h + 30 || d.x < -60 || d.x > w + 60) {
            Object.assign(d, spawnDrop(w, h, true));
          }
        }
      }

      ctx.fillStyle = splashColor;
      for (let i = splashes.current.length - 1; i >= 0; i--) {
        const s = splashes.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.2;
        s.vx *= 0.985;
        s.life -= 0.018;
        if (s.life <= 0) {
          splashes.current.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.min(1, s.life * 1.4);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * Math.min(1, s.life + 0.25), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const section = canvasRef.current?.closest('.hero');
    if (!section) return;

    const onMove = (e: Event) => {
      const pe = e as PointerEvent;
      if (pe.pointerType === 'touch') {
        pointer.current.inside = false;
        return;
      }
      const rect = section.getBoundingClientRect();
      pointer.current.x = pe.clientX - rect.left;
      pointer.current.y = pe.clientY - rect.top;
      pointer.current.inside = true;
    };
    const onLeave = () => {
      pointer.current.inside = false;
      pointer.current.x = -9999;
      pointer.current.y = -9999;
    };

    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} className="hero__rain" aria-hidden="true" />;
};

const UmbrellaCursor: React.FC<{
  enabled: boolean;
  visible: boolean;
  x: number;
  y: number;
}> = ({ enabled, visible, x, y }) => {
  if (!enabled) return null;

  return (
    <div
      className={`hero__umbrella${visible ? ' hero__umbrella--on' : ''}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      aria-hidden="true"
    >
      <div className="hero__umbrella-fold">
        <svg
          className="hero__umbrella-sprite"
          viewBox="0 0 48 52"
          width="48"
          height="52"
          fill="none"
        >
          <path
            className="hero__umbrella-canopy"
            d="M4 26c0-12 10-22 20-22s20 10 20 22
               c-5-4-12-6-20-6s-15 2-20 6z"
          />
          <circle className="hero__umbrella-tip" cx="24" cy="5" r="1.5" />
          <path className="hero__umbrella-pole" d="M24 20v22" />
          <path className="hero__umbrella-handle" d="M24 42c0 5 5 7 8 5.5" />
        </svg>
      </div>
    </div>
  );
};

const UMBRELLA_IDLE_MS = 480;

const Hero: React.FC = () => {
  const { goTo, pageId } = usePage();
  const heroRef = useRef<HTMLElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fxEnabled, setFxEnabled] = useState(true);
  const [cursor, setCursor] = useState({ x: 0, y: 0, on: false, open: false });
  const rainActive = pageId === 'hero';
  const rainOn = fxEnabled && rainActive;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setFxEnabled(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const onHeroMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!fxEnabled || e.pointerType === 'touch' || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setCursor({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        on: true,
        open: true,
      });

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setCursor((c) => (c.on ? { ...c, open: false } : c));
      }, UMBRELLA_IDLE_MS);
    },
    [fxEnabled]
  );

  const onHeroLeave = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setCursor((c) => ({ ...c, on: false, open: false }));
  }, []);

  const umbrellaOpen = cursor.open && rainActive;

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`hero${rainOn ? ' hero--rain' : ''}`}
      onPointerMove={onHeroMove}
      onPointerLeave={onHeroLeave}
    >
      <RainScene enabled={rainOn} active={umbrellaOpen} />
      <UmbrellaCursor
        enabled={rainOn}
        visible={umbrellaOpen}
        x={cursor.x}
        y={cursor.y}
      />

      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.p
          className="hero__hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <span className="hero__hint-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path
                d="M4 14c0-5.5 4.5-10 10-10s10 4.5 10 10c-2.5-2-6-3-10-3s-7.5 1-10 3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M14 11v8.5c0 1.5 1.4 2.2 2.4 1.7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          마우스를 움직이면 우산이 펼쳐집니다
        </motion.p>

        <h1 className="hero__title">Kang Eunjong</h1>

        <p className="hero__lead">
          비를 가리듯, 화면의 경험을 특별하게 만듭니다.
        </p>

        <div className="hero__actions">
          <MagneticButton enabled={fxEnabled}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => goTo('projects')}
            >
              View projects
            </button>
          </MagneticButton>
          <MagneticButton enabled={fxEnabled}>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => goTo('about')}
            >
              About me
            </button>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
