import { Sheep } from './Sheep';
import type { QuadDot } from './types';

export class SheepController {
  img = new Image();
  items: Sheep[] = [];
  cur = 0;
  isLoaded = false;
  stageWidth = 0;
  stageHeight = 0;

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

  draw(ctx: CanvasRenderingContext2D, t: number, dots: QuadDot[]) {
    if (!this.isLoaded) return;

    this.cur += 1;
    if (this.cur > 200) {
      this.cur = 0;
      this.addSheep();
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (item.x < -item.sheepWidth) {
        this.items.splice(i, 1);
      } else {
        item.draw(ctx, t, dots);
      }
    }
  }
}
