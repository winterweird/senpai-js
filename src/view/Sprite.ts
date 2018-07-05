import { IInteractionPoint, IKeyState, ISize, ITextureMap } from "../util/index";
import { easeLinear } from "../ease";
import { EventEmitter } from "events";
import * as m from "../matrix";
const assert = require("assert");

export interface ISprite extends ISize {
  id: string;

  previousPosition: Float64Array; //a, b, c, d, e, f, alpha, z
  position: Float64Array; //a, b, c, d, e, f, alpha, z
  inverse: Float64Array; //a, b, c, d, e, f

  //animation properties
  interpolatedPosition: Float64Array; //a, b, c, d, e, f, alpha
  animationStart: number;
  animationLength: number;

  ease(ratio: number): number;
  
  cursor: "pointer" | "default";

  broadPhase(point: IInteractionPoint): boolean;
  narrowPhase(point: IInteractionPoint): boolean; //narrowPhase point collision detection
  pointCollision(point: IInteractionPoint): boolean;
  keyStateChange(key: IKeyState): void;
  active: boolean; //controlled by the stage
  hover: boolean; //controlled by the stage
  clicked: boolean; //controlled by the stage
  down: boolean; //controlled by the stage
  texture: ImageBitmap | HTMLCanvasElement | HTMLImageElement;

  setTexture(texture: string): this;
  over(timespan: number, ease: Function): this;
  move(position: number[] | Float64Array): this;
  interpolate(now: number): void;
  skipAnimation(): void;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;

  on(event: string, callback: Function): this;
  once(event: string, callback: Function): this;
}

export interface ISpriteProps {
  id: string;
  position: Float64Array | number[];
  textures?: ITextureMap;
}

const VisibleIdentity: Float64Array = new Float64Array([1, 0, 0, 1, 0, 0, 1]);

export class Sprite extends EventEmitter implements ISprite {
  id: string = "";
  position: Float64Array = new Float64Array(8);
  previousPosition: Float64Array = new Float64Array(8);
  interpolatedPosition: Float64Array = new Float64Array(7);
  inverse: Float64Array = new Float64Array(6);

  animationStart: number = 0;
  ease = easeLinear;
  cursor: ("pointer" | "default") = "default";
  animationLength: number = 400;
  active: boolean = false;
  hover: boolean = false;
  clicked: boolean = false;
  down: boolean = false;
  textures: ITextureMap = {};
  texture: ImageBitmap | HTMLCanvasElement | HTMLImageElement = new Image();
  //ISize
  width: number = 0;
  height: number = 0;

  constructor(props: ISpriteProps) {
    super();
    this.id = props.id;
    const position = props.position || VisibleIdentity;
    this.textures = props.textures ? props.textures : this.textures;
    m.set(this.position, position);
    m.set(this.previousPosition, position);
    m.set(this.interpolatedPosition, position);
    if (position.length < 6) {
      this.position[6] = 1; //visible
    }
  }
  broadPhase(point: IInteractionPoint): boolean {
    return point.tx >= 0 && point.tx <= this.width && point.ty >= 0 && point.ty <= this.height;
  }
  narrowPhase(point: IInteractionPoint): boolean {
    return true;
  }
  pointCollision(point: IInteractionPoint): boolean {
    this.clicked = point.clicked;
    this.down = point.down;
    this.hover = true;
    point.captured = true;
    this.emit("point-move", point);
    if (point.clicked && point.active === this) {
      super.emit("click", point);
    }
    if (point.firstDown) {
      super.emit("active", this);
    }
    return true;
  }
  move(position: number[] | Float64Array): this {
    this.previousPosition[0] = this.interpolatedPosition[0];
    this.previousPosition[1] = this.interpolatedPosition[1];
    this.previousPosition[2] = this.interpolatedPosition[2];
    this.previousPosition[3] = this.interpolatedPosition[3];
    this.previousPosition[4] = this.interpolatedPosition[4];
    this.previousPosition[5] = this.interpolatedPosition[5];
    this.previousPosition[6] = this.interpolatedPosition[6];
    this.previousPosition[7] = this.position[7];

    this.position[0] = position[0];
    this.position[1] = position[1];
    this.position[2] = position[2];
    this.position[3] = position[3];
    this.position[4] = position[4];
    this.position[5] = position[5];
    this.position[6] = position[6];
    this.position[7] = position[7];

    return this;
  }
  over(timespan: number, ease?: (ratio: number) => number): this {
    this.animationLength = timespan;
    this.animationStart = Date.now();
    this.ease = ease || this.ease;
    return this;
  }
  keyStateChange(key: IKeyState): void {

  }
  skipAnimation() {
    this.animationLength = 0;
  }
  update(): void {
    
  }
  interpolate(now: number) {
    const progress = now - this.animationStart
    const ratio = (progress >= this.animationLength)
        ? 1
        : this.ease(progress / this.animationLength);

    if (ratio === 1) {
      this.interpolatedPosition[0] = this.position[0];
      this.interpolatedPosition[1] = this.position[1];
      this.interpolatedPosition[2] = this.position[2];
      this.interpolatedPosition[3] = this.position[3];
      this.interpolatedPosition[4] = this.position[4];
      this.interpolatedPosition[5] = this.position[5];
      this.interpolatedPosition[6] = this.position[6];
    } else {
      for (let j = 0; j < 7; j++) {
        this.interpolatedPosition[j] = this.previousPosition[j]
          + ratio * (this.position[j] - this.previousPosition[j]);
      }
    }

    m.inverse(this.interpolatedPosition, this.inverse);
  }
  setTexture(texture: string): this {
    assert(this.textures[texture]);

    const oldTexture = this.texture;
    this.texture = this.textures[texture];
    this.width = this.texture.width;
    this.height = this.texture.height;

    if (oldTexture !== this.texture) {
      this.emit("texture-change", this.texture);
    }

    return this;
  }
  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.texture, 0, 0);
  }
};

