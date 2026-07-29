import type { Point } from './types';

export type CelestialKind = 'sun' | 'moon';

export class Sun {
  radius = 200;
  total = 60;
  gap = 1 / 60;
  originPos: Point[] = [];
  pos: Point[] = [];
  stageWidth = 0;
  stageHeight = 0;
  x = 0;
  y = 0;
  fps = 30;
  fpsTime = 1000 / 30;
  time = 0;
  kind: CelestialKind = 'sun';
  color = '#ffb200';
  skyColor = '#ffcaec';

  constructor() {
    for (let i = 0; i < this.total; i++) {
      const pos = this.getCirclePoint(this.radius, i * this.gap);
      this.originPos[i] = pos;
      this.pos[i] = pos;
    }
  }

  setAppearance(kind: CelestialKind, color: string, skyColor: string) {
    this.kind = kind;
    this.color = color;
    this.skyColor = skyColor;
  }

  resize(stageWidth: number, stageHeight: number) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.x = this.stageWidth - this.radius - 140;
    this.y = this.radius + 100;
  }

  draw(ctx: CanvasRenderingContext2D, t: number) {
    if (!this.time) this.time = t;
    const now = t - this.time;
    if (now > this.fpsTime) {
      this.time = t;
      this.updatePoints();
    }

    if (this.kind === 'moon') {
      this.drawGlow(ctx);
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    for (let i = 0; i < this.total; i++) {
      const pos = this.pos[i];
      ctx.lineTo(pos.x + this.x, pos.y + this.y);
    }
    ctx.fill();

    if (this.kind === 'moon') {
      // 하늘색으로 일부를 가려 초승달 형태
      ctx.fillStyle = this.skyColor;
      ctx.beginPath();
      ctx.arc(
        this.x + this.radius * 0.38,
        this.y - this.radius * 0.18,
        this.radius * 0.82,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  private drawGlow(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius * 0.35,
      this.x,
      this.y,
      this.radius * 1.35
    );
    gradient.addColorStop(0, 'rgba(200, 220, 255, 0.28)');
    gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 1.35, 0, Math.PI * 2);
    ctx.fill();
  }

  private updatePoints() {
    for (let i = 0; i < this.total; i++) {
      const pos = this.originPos[i];
      this.pos[i] = {
        x: pos.x + this.ranInt(5),
        y: pos.y + this.ranInt(5),
      };
    }
  }

  private ranInt(max: number) {
    return Math.random() * max;
  }

  private getCirclePoint(radius: number, t: number): Point {
    const theta = t * Math.PI * 2;
    return {
      x: Math.cos(theta) * radius,
      y: Math.sin(theta) * radius,
    };
  }
}
