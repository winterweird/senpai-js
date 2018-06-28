import { EventEmitter } from "events";
import { ISprite } from "./Sprite";
import { ISize } from "./util";

export interface IStageProps extends ISize {
  selector: string;
}

export interface IStage {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  addSprite(sprite: ISprite): IStage;
  sprites: ISprite[];
  update(): void;
  render(): void;
}

const sortZ = (a: ISprite, b: ISprite) => a.position[7] - b.position[7];

export class Stage extends EventEmitter {
  constructor(props: IStageProps) {
    super();
    
    this.canvas.width = props.width;
    this.canvas.height = props.height;

    document.querySelector(props.selector).appendChild(this.canvas);
  }
  canvas: HTMLCanvasElement = document.createElement("canvas");
  ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
  sprites: ISprite[] = [];

  update() {
    super.emit("pre-update");
    for(let i = 0; i)
    super.emit("post-update");
  }
  render() {
    super.emit("pre-render");
    this.sprites.sort(sortZ);
    let sprite: ISprite;
    let pointer: boolean = false;
    let ctx = this.ctx;

    for(let i = 0; i < this.sprites.length; i++) {
      sprite = this.sprites[i];
      ctx.save();
      ctx.setTransform(
        sprite.interpolatedPosition[0],
        sprite.interpolatedPosition[1],
        sprite.interpolatedPosition[2],
        sprite.interpolatedPosition[3],
        sprite.interpolatedPosition[4],
        sprite.interpolatedPosition[5],
      );
      ctx.globalAlpha = sprite.interpolatedPosition[6];
      this.sprites[i].render(ctx);
      ctx.restore();
      pointer = pointer || (sprite.hover && sprite.cursor === "pointer");
    }

    this.canvas.style.cursor = pointer ? "pointer" : "default";
    super.emit("post-render");
  }
}

