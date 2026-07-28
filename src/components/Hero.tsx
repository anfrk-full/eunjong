import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePage } from '../context/PageContext';

const MAGNET_STRENGTH = 0.28;
const MAGNET_MAX = 20;
const TILT_MAX = 8;
const DROP_COUNT = 90;
const UMBRELLA_W = 72;
const UMBRELLA_H = 28;

type Drop = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
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
  return {
    x: Math.random() * w,
    y: fromTop ? -Math.random() * h * 0.4 : Math.random() * h,
    vx: -0.35 - Math.random() * 0.45,
    vy: 4.2 + Math.random() * 3.2,
    len: 10 + Math.random() * 12,
  };
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
      size.current = { w: rect.width, h: rect.height };
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops.current = Array.from({ length: DROP_COUNT }, () =>
        spawnDrop(rect.width, rect.height, false)
      );
      splashes.current = [];
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const isLight = () =>
      document.documentElement.getAttribute('data-theme') === 'light';

    const hitUmbrella = (d: Drop) => {
      if (!pointer.current.inside || !active) return false;
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

    /** 긴 빗줄기 제거 + 둥근 물방울로 쪼개져 흩어짐 */
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

    const tick = () => {
      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);

      const light = isLight();
      const rainColor = light ? 'rgba(37, 99, 235, 0.38)' : 'rgba(186, 210, 255, 0.42)';
      const splashColor = light ? 'rgba(37, 99, 235, 0.55)' : 'rgba(210, 228, 255, 0.62)';

      ctx.strokeStyle = rainColor;
      ctx.lineWidth = 1.25;
      ctx.lineCap = 'round';

      for (const d of drops.current) {
        if (hitUmbrella(d)) {
          shatter(d, w, h);
          continue;
        }

        d.x += d.vx;
        d.y += d.vy;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.vx * 1.2, d.y + d.len);
        ctx.stroke();

        if (d.y > h + 20 || d.x < -40 || d.x > w + 40) {
          Object.assign(d, spawnDrop(w, h, true));
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
  }, [enabled, active]);

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
      <svg
        className="hero__umbrella-sprite"
        viewBox="0 0 48 52"
        width="48"
        height="52"
        fill="none"
      >
        {/* canopy */}
        <path
          className="hero__umbrella-canopy"
          d="M4 26c0-12 10-22 20-22s20 10 20 22
             c-5-4-12-6-20-6s-15 2-20 6z"
        />
        {/* tip */}
        <circle className="hero__umbrella-tip" cx="24" cy="5" r="1.5" />
        {/* shaft */}
        <path className="hero__umbrella-pole" d="M24 20v22" />
        {/* handle */}
        <path className="hero__umbrella-handle" d="M24 42c0 5 5 7 8 5.5" />
      </svg>
    </div>
  );
};

const Hero: React.FC = () => {
  const { goTo, pageId } = usePage();
  const heroRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [fxEnabled, setFxEnabled] = useState(true);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [cursor, setCursor] = useState({ x: 0, y: 0, on: false });
  const rainActive = pageId === 'hero';

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setFxEnabled(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const onHeroMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!fxEnabled || e.pointerType === 'touch' || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setCursor({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        on: true,
      });
    },
    [fxEnabled]
  );

  const onHeroLeave = useCallback(() => {
    setCursor((c) => ({ ...c, on: false }));
  }, []);

  const onPanelMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!fxEnabled || e.pointerType === 'touch' || !panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setTilt({
        rx: (0.5 - py) * TILT_MAX * 2,
        ry: (px - 0.5) * TILT_MAX * 2,
      });
      setSpot({ x: px * 100, y: py * 100 });
    },
    [fxEnabled]
  );

  const onPanelLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
    setSpot({ x: 50, y: 50 });
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`hero${fxEnabled && rainActive ? ' hero--rain' : ''}`}
      onPointerMove={onHeroMove}
      onPointerLeave={onHeroLeave}
    >
      <RainScene enabled={fxEnabled && rainActive} active={cursor.on && rainActive} />
      <UmbrellaCursor
        enabled={fxEnabled && rainActive}
        visible={cursor.on && rainActive}
        x={cursor.x}
        y={cursor.y}
      />

      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Available for work
        </div>

        <h1 className="hero__title">
          Kang Eunjong
          <br />
          <span>Full-Stack Developer</span>
        </h1>

        <p className="hero__lead">
          프론트엔드부터 백엔드까지, 쓰기 편한 서비스를 설계하고 만듭니다.
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
              onClick={() => goTo('worklog')}
            >
              Work log
            </button>
          </MagneticButton>
        </div>

        <div className="hero__panel-stage">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              ref={panelRef}
              className={`hero__panel${fxEnabled ? ' hero__panel--tilt' : ''}`}
              onPointerMove={onPanelMove}
              onPointerLeave={onPanelLeave}
              style={
                fxEnabled
                  ? {
                      transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                      ['--spot-x' as string]: `${spot.x}%`,
                      ['--spot-y' as string]: `${spot.y}%`,
                    }
                  : undefined
              }
            >
              <div className="hero__panel-bar">
                <span className="hero__panel-dot" />
                <span className="hero__panel-dot" />
                <span className="hero__panel-dot" />
              </div>
              <div className="hero__panel-body">
                <div className="hero__stat">
                  <p className="hero__stat-label">Focus</p>
                  <p className="hero__stat-value">Full-Stack</p>
                </div>
                <div className="hero__stat">
                  <p className="hero__stat-label">Stack</p>
                  <p className="hero__stat-value">React · PHP</p>
                </div>
                <div className="hero__stat">
                  <p className="hero__stat-label">Based in</p>
                  <p className="hero__stat-value">Gwangju</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
