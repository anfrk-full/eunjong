import React, { useEffect, useRef } from 'react';
import type { Theme } from '../../context/ThemeContext';
import { Hill } from '../../sheep/Hill';
import { SheepController } from '../../sheep/SheepController';
import { Sun } from '../../sheep/Sun';

type Props = {
  active: boolean;
  theme: Theme;
};

type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
};

type Palette = {
  bg: string;
  hills: [string, string, string];
  kind: 'sun' | 'moon';
  celestial: string;
};

const PALETTES: Record<Theme, Palette> = {
  light: {
    bg: '#87ceeb',
    hills: ['#a8e063', '#7cb342', '#558b2f'],
    kind: 'sun',
    celestial: '#ffb200',
  },
  dark: {
    bg: '#12102a',
    hills: ['#2a2150', '#3a2d6e', '#52408f'],
    kind: 'moon',
    celestial: '#eef3ff',
  },
};

const SheepHillsBackground: React.FC<Props> = ({ active, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sun = new Sun();
    const hills = [
      new Hill(PALETTES.light.hills[0], 0.2, 12),
      new Hill(PALETTES.light.hills[1], 0.5, 8),
      new Hill(PALETTES.light.hills[2], 1.4, 6),
    ];
    const sheepController = new SheepController();
    let stars: Star[] = [];

    let stageWidth = 0;
    let stageHeight = 0;
    let raf = 0;

    const applyPalette = (mode: Theme) => {
      const palette = PALETTES[mode];
      for (let i = 0; i < hills.length; i++) {
        hills[i].color = palette.hills[i];
      }
      sun.setAppearance(palette.kind, palette.celestial, palette.bg);
    };

    const spawnStars = (w: number, h: number) => {
      const count = Math.max(40, Math.floor((w * h) / 18000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.55,
        r: 0.6 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0015 + Math.random() * 0.0025,
      }));
    };

    const drawStars = (t: number) => {
      for (const star of stars) {
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * star.speed + star.phase));
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = '#dce7ff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      stageWidth = rect.width;
      stageHeight = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(stageWidth * dpr);
      canvas.height = Math.floor(stageHeight * dpr);
      canvas.style.width = `${stageWidth}px`;
      canvas.style.height = `${stageHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sun.resize(stageWidth, stageHeight);
      for (let i = 0; i < hills.length; i++) {
        hills[i].resize(stageWidth, stageHeight);
      }
      sheepController.resize(stageWidth, stageHeight);
      spawnStars(stageWidth, stageHeight);
      applyPalette(themeRef.current);
    };

    applyPalette(themeRef.current);
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const animate = (t: number) => {
      const mode = themeRef.current;
      const palette = PALETTES[mode];
      applyPalette(mode);

      ctx.clearRect(0, 0, stageWidth, stageHeight);
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, stageWidth, stageHeight);

      if (mode === 'dark') {
        drawStars(t);
      }

      sun.draw(ctx, t);

      let dots = hills[0].draw(ctx);
      for (let i = 1; i < hills.length; i++) {
        dots = hills[i].draw(ctx);
      }

      sheepController.draw(ctx, t, dots);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="about__sheep-bg"
      aria-hidden="true"
    />
  );
};

export default SheepHillsBackground;
