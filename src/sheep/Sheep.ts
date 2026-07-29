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
  held = false;
  falling = false;
  private grabOffsetX = 0;
  private grabOffsetY = 0;
  private drawLeft = 0;
  private drawTop = 0;
  private drawRight = 0;
  private drawBottom = 0;
  private vy = 0;
  private fallRot = 0;
  private fallRotV = 0;
  private lastAnimT = 0;

  constructor(img: HTMLImageElement, stageWidth: number) {
    this.img = img;
    this.sheepWidthHalf = this.sheepWidth / 2;
    this.x = stageWidth + this.sheepWidth;
    this.speed = Math.random() * 2 + 1;
  }

  hitTest(px: number, py: number): boolean {
    const pad = 12;
    return (
      px >= this.drawLeft - pad &&
      px <= this.drawRight + pad &&
      py >= this.drawTop - pad &&
      py <= this.drawBottom + pad
    );
  }

  pickUp(px: number, py: number) {
    this.held = true;
    this.falling = false;
    this.vy = 0;
    this.fallRot = 0;
    this.grabOffsetX = this.x - px;
    this.grabOffsetY = this.y - py;
  }

  dragTo(px: number, py: number) {
    if (!this.held) return;
    this.x = px + this.grabOffsetX;
    this.y = py + this.grabOffsetY;
  }

  release() {
    if (!this.held) return;
    this.held = false;
    this.falling = true;
    this.vy = 1.2;
    this.fallRot = 0;
    this.fallRotV = (Math.random() - 0.5) * 0.045;
    this.lastAnimT = 0;
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
    this.animate(ctx, t, dots);
  }

  private animate(ctx: CanvasRenderingContext2D, t: number, dots: QuadDot[]) {
    if (this.held) {
      this.drawHeld(ctx, t);
      return;
    }

    if (this.falling) {
      this.drawFalling(ctx, t, dots);
      return;
    }

    this.x -= this.speed;
    const closest = this.getY(this.x, dots);
    this.y = closest.y;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(closest.rotation);
    this.paintSprite(ctx);
    ctx.restore();

    this.updateHitBox(this.x, this.y, closest.rotation);
  }

  private drawFalling(ctx: CanvasRenderingContext2D, t: number, dots: QuadDot[]) {
    const dt = this.lastAnimT ? Math.min(2.2, (t - this.lastAnimT) / 16.67) : 1;
    this.lastAnimT = t;

    const gravity = 0.55;
    this.vy += gravity * dt;
    // 낙하 속도 상한
    this.vy = Math.min(this.vy, 18);
    this.y += this.vy * dt;
    this.fallRot += this.fallRotV * dt;

    const ground = this.getY(this.x, dots);
    const groundY = ground.y;

    // 땅이 유효하고 지면에 닿으면 착지
    const hasGround = !(ground.y === 0 && ground.x === 0 && ground.rotation === 0);
    if (hasGround && this.y >= groundY) {
      this.y = groundY;
      this.falling = false;
      this.vy = 0;
      this.fallRot = 0;
      this.lastAnimT = 0;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(ground.rotation);
      this.paintSprite(ctx);
      ctx.restore();
      this.updateHitBox(this.x, this.y, ground.rotation);
      return;
    }

    // 떨어지는 동안 아주 약한 떨림
    const shakeX = Math.sin(t * 0.08) * 1.2;
    const shakeY = Math.cos(t * 0.1) * 0.8;

    ctx.save();
    ctx.translate(this.x + shakeX, this.y + shakeY);
    ctx.rotate(this.fallRot);
    this.paintSprite(ctx);
    ctx.restore();

    this.updateHitBox(this.x + shakeX, this.y + shakeY, this.fallRot);
  }

  private drawHeld(ctx: CanvasRenderingContext2D, t: number) {
    const shakeX =
      Math.sin(t * 0.045) * 2.4 + Math.sin(t * 0.11) * 1.6 + Math.sin(t * 0.19) * 0.8;
    const shakeY =
      Math.cos(t * 0.052) * 2.2 + Math.sin(t * 0.13) * 1.4 + Math.cos(t * 0.21) * 0.7;
    const shakeRot =
      Math.sin(t * 0.09) * 0.055 + Math.cos(t * 0.15) * 0.03;

    const drawX = this.x + shakeX;
    const drawY = this.y + shakeY;

    ctx.save();
    ctx.translate(drawX, drawY);
    ctx.rotate(shakeRot);
    ctx.translate(0, -8);
    this.paintSprite(ctx);
    ctx.restore();

    this.updateHitBox(drawX, drawY - 8, shakeRot);
  }

  private paintSprite(ctx: CanvasRenderingContext2D) {
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
  }

  private updateHitBox(cx: number, cy: number, rotation: number) {
    const top = cy - this.sheepHeight + 20;
    const bottom = cy + 20;
    const left = cx - this.sheepWidthHalf;
    const right = cx + this.sheepWidthHalf;
    const pad = Math.abs(Math.sin(rotation)) * this.sheepWidth * 0.15;
    this.drawLeft = left - pad;
    this.drawRight = right + pad;
    this.drawTop = top - pad;
    this.drawBottom = bottom + pad;
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
