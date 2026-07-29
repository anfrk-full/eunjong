import { Sheep } from './Sheep';
import type { QuadDot } from './types';

export class SheepController {
  img = new Image();
  items: Sheep[] = [];
  cur = 0;
  isLoaded = false;
  stageWidth = 0;
  stageHeight = 0;
  held: Sheep | null = null;

  constructor(src = `${process.env.PUBLIC_URL}/sheep.png`) {
    this.img.onload = () => this.loaded();
    this.img.src = src;
  }

  resize(stageWidth: number, stageHeight: number) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  }

  private loaded() {
    this.isLoaded = true;
    this.addSheep();
  }

  private addSheep() {
    this.items.push(new Sheep(this.img, this.stageWidth));
  }

  pointerDown(x: number, y: number): boolean {
    // 나중에 그린 양(앞쪽)부터 히트 테스트
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.hitTest(x, y)) {
        this.held = item;
        item.pickUp(x, y);
        // 잡은 양을 배열 앞으로 옮겨 항상 위에 그리기
        this.items.splice(i, 1);
        this.items.unshift(item);
        return true;
      }
    }
    return false;
  }

  pointerMove(x: number, y: number) {
    if (!this.held) return;
    this.held.dragTo(x, y);
  }

  pointerUp() {
    if (!this.held) return;
    this.held.release();
    this.held = null;
  }

  draw(ctx: CanvasRenderingContext2D, t: number, dots: QuadDot[]) {
    if (!this.isLoaded) return;

    this.cur += 1;
    if (this.cur > 200) {
      this.cur = 0;
      this.addSheep();
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (!item.held && !item.falling && item.x < -item.sheepWidth) {
        this.items.splice(i, 1);
      } else {
        item.draw(ctx, t, dots);
      }
    }
  }
}