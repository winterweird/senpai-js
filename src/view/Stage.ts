import { EventEmitter } from "events";
import { ISprite } from "./Sprite";
import { ISize } from "./util";
import { inverse } from "./Matrix";
import { ISoundSprite } from "./SoundSprite"

export interface IStageProps extends ISize {
  selector: string;
}

export interface IStage {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  audioContext: AudioContext;
  addSprite(sprite: ISprite): IStage;
  removeSprite(sprite: ISprite): IStage;
  sprites: ISprite[];
  soundSprites: ISoundSprite[];
  update(): void;
  render(): void;
}

const sortZ = (a: ISprite, b: ISprite): number => a.position[7] - b.position[7];

export class Stage extends EventEmitter {
  constructor(props: IStageProps) {
    super();
    
    this.canvas.width = props.width;
    this.canvas.height = props.height;

    document.querySelector(props.selector).appendChild(this.canvas);
    this.hookEvents();
  }
  canvas: HTMLCanvasElement = document.createElement("canvas");
  ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
  sprites: ISprite[] = [];
  soundSprites: ISoundSprite[] = [];
  audioContext: AudioContext = new AudioContext;

  hookEvents(): void {

  }
  addSprite(sprite: ISprite): IStage {
    if (!this.sprites.includes(sprite)) {
      this.sprites.push(sprite);
      super.emit("sprite-add", sprite);
    }
    return this;
  }
  removeSprite(sprite: ISprite): IStage {
    if (this.sprites.includes(sprite)) {
      const index = this.sprites.indexOf(sprite);
      this.sprites.splice(index, 1);
      super.emit("sprite-remove", sprite);
    }
    return this;
  }
  addSoundSprite(sprite: ISoundSprite): IStage {
    if (!this.soundSprites.includes(sprite)) {
      this.soundSprites.push(sprite);
      sprite.gain.connect(this.audioContext.destination);
      super.emit("sound-sprite-add", sprite);
    }
    return this;
  }
  update() {
    super.emit("pre-update");
    this.calcluateInterpolatedPositions();
    this.checkActiveState();
    super.emit("post-update");
  }
  private calcluateInterpolatedPositions(): void {
    const now = Date.now();
    let sprite: ISprite;
    let ratioCompleted: number = 0;
    let ratio: number = 0;
    for (let i = 0; i < this.sprites.length; i++) {
      sprite = this.sprites[i];
      ratioCompleted = ((now - sprite.animationStart) >= sprite.animationLength)
        ? 1
        : (now - sprite.animationStart) / sprite.animationLength;
      ratio = sprite.ease(ratioCompleted);
      for (let j = 0; j < 7; j++)
        sprite.interpolatedPosition[j] = sprite.previousPosition[j]
          + ratio * (sprite.position[j] - sprite.previousPosition[j]);
    }
  }
  private checkActiveState(): void {
    let sprite: ISprite;
    let inversePosition = [0, 0, 0, 0, 0, 0]
    for (let i = 0; i < this.sprites.length; i++) {
      sprite = this.sprites[i];
      inverse(sprite.interpolatedPosition, inversePosition);
    }
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

const x = new AudioContext;
x.createBuffer