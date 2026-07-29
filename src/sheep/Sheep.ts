import type { QuadDot } from './types';

type CurvePoint = {
  x: number;
  y: number;
  rotation: number;
};

export class Sheep {
  img: HTMLImageElement;
  totalFrame = 8;
  curFrame = 0;
  imgWidth = 360;
  imgHeight = 300;
  sheepWidth = 180;
  sheepHeight = 150;
  sheepWidthHalf: number;
  x: number;
  y = 0;
  speed: number;
  fps = 24;
  fpsTime = 1000 / 24;
  time = 0;

  constructor(img: HTMLImageElement, stageWidth: number) {
    this.img = img;
    this.sheepWidthHalf = this.sheepWidth / 2;
    this.x = stageWidth + this.sheepWidth;
    this.speed = Math.random() * 2 + 1;
  }

  draw(ctx: CanvasRenderingContext2D, t: number, dots: QuadDot[]) {
    if (!this.time) this.time = t;
    const now = t - this.time;
    if (now > this.fpsTime) {
      this.time = t;
      this.curFrame += 1;
      if (this.curFrame === this.totalFrame) {
        this.curFrame = 0;
      }
    }
    this.animate(ctx, dots);
  }

  private animate(ctx: CanvasRenderingContext2D, dots: QuadDot[]) {
    this.x -= this.speed;
    const closest = this.getY(this.x, dots);
    this.y = closest.y;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(closest.rotation);
    ctx.drawImage(
      this.img,
      this.imgWidth * this.curFrame,
      0,
      this.imgWidth,
      this.imgHeight,
      -this.sheepWidthHalf,
      -this.sheepHeight + 20,
      this.sheepWidth,
      this.sheepHeight
    );
    ctx.restore();
  }

  private getY(x: number, dots: QuadDot[]): CurvePoint {
    for (let i = 1; i < dots.length; i++) {
      if (x >= dots[i].x1 && x <= dots[i].x3) {
        return this.getY2(x, dots[i]);
      }
    }
    return { y: 0, rotation: 0, x: 0 };
  }

  private getY2(x: number, dot: QuadDot): CurvePoint {
    const total = 200;
    let pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, 0);
    let prevX = pt.x;

    for (let i = 1; i < total; i++) {
      const t = i / total;
      pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, t);
      if (x >= prevX && x <= pt.x) {
        return pt;
      }
      prevX = pt.x;
    }
    return pt;
  }

  private getQuadValue(p0: number, p1: number, p2: number, t: number) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  private getPointOnQuad(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    t: number
  ): CurvePoint {
    const tx = this.quadTangent(x1, x2, x3, t);
    const ty = this.quadTangent(y1, y2, y3, t);
    const rotation = -Math.atan2(tx, ty) + (90 * Math.PI) / 180;
    return {
      x: this.getQuadValue(x1, x2, x3, t),
      y: this.getQuadValue(y1, y2, y3, t),
      rotation,
    };
  }

  private quadTangent(a: number, b: number, c: number, t: number) {
    return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
  }
}
