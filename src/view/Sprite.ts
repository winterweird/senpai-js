import { IInteractionPoint, IKeyState, ISize } from "./util";
import { easeLinear } from "../ease";
import { EventEmitter } from "events";
import { Identity, inverse } from "./Matrix";

export interface ISprite extends ISize {
  previousPosition: Float64Array; //a, b, c, d, e, f, alpha, z
  position: Float64Array; //a, b, c, d, e, f, alpha, z
  inverse: Float64Array; //a, b, c, d, e, f

  //animation properties
  interpolatedPosition: Float64Array; //a, b, c, d, e, f, alpha
  animationStart: number;
  animationLength: number;

  ease: Function;
  cursor: "pointer" | "default";

  broadPhase(point: IInteractionPoint): boolean;
  narrowPhase(point: IInteractionPoint): boolean; //narrowPhase point collision detection
  pointCollision(point: IInteractionPoint): boolean;
  keyStateChange(key: IKeyState): void;
  active: boolean; //controlled by the stage
  hover: boolean; //controlled by the stage
  clicked: boolean; //controlled by the stage
  down: boolean; //controlled by the stage

  move(position: number[] | Float64Array): ISprite;
  interpolate(now: number): void;
  skipAnimation(): void;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;

  
  on(event: string, callback: Function): this;
  once(event: string, callback: Function): this;
}

export interface ISpriteProps {
  position: Float64Array | number[];
}

export class Sprite extends EventEmitter implements ISprite {
  position: Float64Array = new Float64Array(8);
  previousPosition: Float64Array = new Float64Array(8);
  interpolatedPosition: Float64Array = new Float64Array(7);
  inverse: Float64Array = new Float64Array(6);

  animationStart: number = 0;
  ease: Function = easeLinear;
  cursor: ("pointer" | "default") = "default";
  animationLength: number = 400;
  active: boolean = false;
  hover: boolean = false;
  clicked: boolean = false;
  down: boolean = false;

  //ISize
  width: number = 0;
  height: number = 0;

  constructor(props: ISpriteProps) {
    super();
    const position = props.position || Identity;
    this.position.set(position);
    this.previousPosition.set(position);
    this.interpolatedPosition.set(position);
    this.position[6] = 1; //visible
  }
  broadPhase(point: IInteractionPoint): boolean {
    return point.x >= 0 && point.x <= this.width && point.y >= 0 && point.y <= this.height;
  }
  narrowPhase(point: IInteractionPoint): boolean {
    return false;
  }
  pointCollision(point: IInteractionPoint): boolean {
    this.emit("point-move", point);
    return true;
  }
  move(position: number[] | Float64Array): ISprite {
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
  keyStateChange(key: IKeyState): void {

  }
  skipAnimation() {
    this.animationLength = 0;
  }
  update(): void {
    if (this.clicked) {
      super.emit("clicked", this);
    }
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
    
    inverse(this.interpolatedPosition, this.inverse);
  }
  render(ctx: CanvasRenderingContext2D) {

  }
};

