import { IInteractionPoint, IKeyState, ISize } from "./util";
import { easeLinear } from "../ease";
import { EventEmitter } from "events";
import { Identity, inverse } from "./Matrix";

export interface ISprite {
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

  interpolate(now: number): void;
  skipAnimation(): void;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;
}

export interface ISpriteProps {
  position: Float64Array | number[];
}

export class Sprite extends EventEmitter implements ISprite, ISize {
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
  }
  broadPhase(point: IInteractionPoint): boolean {
    return point.x >= 0 && point.x <= this.width && point.y >= 0 && point.y <= this.height;
  }
  narrowPhase(point: IInteractionPoint): boolean {
    return false;
  }
  pointCollision(point: IInteractionPoint): boolean {
    return false;
  }
  keyStateChange(key: IKeyState): void {

  }
  skipAnimation() {
    this.animationLength = 0;
  }
  update(): void {
    if (this.clicked) {
      super.emit("click", this);
    }
    if (this.down) {
      super.emit("down", this);
    }
  }
  interpolate(now: number) {
    const progress = now - this.animationStart
    const ratio = (progress >= this.animationLength)
        ? 1
        : this.ease(progress / this.animationLength);

    if (ratio === 1) {
      this.interpolatedPosition.set(this.position)
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

