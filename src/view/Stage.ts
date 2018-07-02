import { EventEmitter } from "events";
import { ISprite } from "./Sprite";
import { ISize, IInteractionPoint } from "./util";
import { ISoundSprite } from "./SoundSprite"
import { transformPoints } from "./Matrix";

export interface IStageProps extends ISize {
  selector: string;
};

export interface ITouchIndex {
  [id: string]: IInteractionPoint;
};


export interface IStage {
  addSprite(sprite: ISprite): IStage;
  removeSprite(sprite: ISprite): IStage;
  addSoundSprite(sprite: ISoundSprite): IStage;
  removeSoundSprite(sprite: ISoundSprite): IStage;
  skipAnimations(): IStage;
  update(): IStage;
  render(): IStage;
};

const sortZ = (a: ISprite, b: ISprite): number => a.position[7] - b.position[7];

export class Stage extends EventEmitter {
  constructor(props: IStageProps) {
    super();
    
    this.canvas.width = props.width;
    this.canvas.height = props.height;

    document.querySelector(props.selector).appendChild(this.canvas);
    this.hookEvents();
  }
  private canvas: HTMLCanvasElement = document.createElement("canvas");
  private ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
  private sprites: ISprite[] = [];
  private soundSprites: ISoundSprite[] = [];
  private audioContext: AudioContext = new AudioContext;
  private mousePoint: IInteractionPoint = {
    id: "mouse",
    captured: false,
    clicked: false,
    down: false,
    type: "Mouse",
    x: 0,
    y: 0,
  };
  private pointIndex: ITouchIndex = {};
  private points: IInteractionPoint[] = [this.mousePoint];
  private hookEvents(): void {
    document.body.addEventListener("mouseup", e => this.mouseUp(e));
    this.canvas.addEventListener("mousedown", e => this.mouseDown(e));
    this.canvas.addEventListener("mousemove", e => this.mouseMove(e));
    this.canvas.addEventListener("touchstart", e => this.touchStart(e));
  }
  private touchStart(e: TouchEvent) {
    const { changedTouches } = e;
    const rect: ClientRect = this.canvas.getBoundingClientRect();

    for (let i = 0; i < changedTouches.length; i++) {
      let touch = changedTouches[1]
      if (touch.target === this.canvas) {
        const point: IInteractionPoint = {
          id: touch.identifier.toString(),
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          captured: false,
          down: true,
          clicked: false,
          type: "Touch"
        };
        this.pointIndex[touch.identifier.toString()] = point;
        this.points.push(point);
      }
    }
  }
  private cleanUp() {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].clicked = false;
      this.points[i].captured = false;
    }
  }
  private mouseUp(e: MouseEvent): void {
    if (this.mousePoint.down) {
      this.mousePoint.clicked = true;
    }
    this.mousePoint.down = false;
    return this.mouseMove(e);
  }
  private mouseDown(e: MouseEvent) {
    this.mousePoint.down = true;
    e.preventDefault();
    return this.mouseMove(e);
  }
  private mouseMove(e: MouseEvent) {
    const rect: ClientRect = this.canvas.getBoundingClientRect();
    this.mousePoint.x = e.clientX - rect.left;
    this.mousePoint.y = e.clientY - rect.top;
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
  removeSoundSprite(sprite: ISoundSprite): IStage {
    if (!this.soundSprites.includes(sprite)) {
      const index = this.soundSprites.indexOf(sprite);
      this.soundSprites.splice(index, 1);
      super.emit("sound-sprite-remove", sprite);
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
  skipAnimations(): IStage {
    for(let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].skipAnimation();
    }
    return this;
  }
  update(): IStage {
    super.emit("pre-stage-update");
    const now: number = Date.now();
    let points: IInteractionPoint[] = null;

    super.emit("pre-interpolate");
    for(let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].interpolate(now);
    }
    this.sprites.sort(sortZ);
    super.emit("post-interpolate");

    super.emit("pre-collision");
    let point: IInteractionPoint, sprite: ISprite;
    for(let i = 0; i < this.sprites.length; i++) {
      sprite = this.sprites[i];
      points = transformPoints(this.points, sprite.inverse);
      for(let j = 0; j < points.length; j++) {
        point = points[j];
        if (point.captured) {
          continue;
        }
        if (sprite.broadPhase(point) && sprite.narrowPhase(point)) {
          sprite.clicked = point.clicked;
          sprite.down = point.down;
          sprite.hover = true;
          sprite.pointCollision(point);
          break;
        }
      }
    }
    super.emit("post-collision");

    super.emit("pre-update");
    for (let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].update();
    }
    super.emit("post-update");

    this.cleanUp();
    super.emit("post-stage-update");
    return this;
  }
  render(): IStage {
    super.emit("pre-render");
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
      sprite.render(ctx);
      ctx.restore();
      pointer = pointer || (sprite.hover && sprite.cursor === "pointer");
    }

    this.canvas.style.cursor = pointer ? "pointer" : "default";

    super.emit("post-render");
    return this;
  }
};