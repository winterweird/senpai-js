import { IInteractionPoint, IKeyState, ISize } from "./util";
import { easeLinear } from "../ease";
import { EventEmitter } from "events";
import { Identity } from "./Matrix";

export interface ISprite {
  previousPosition: Float64Array; //a, b, c, d, e, f, alpha, z
  position: Float64Array; //a, b, c, d, e, f, alpha, z

  //animation properties
  interpolatedPosition: Float64Array; //a, b, c, d, e, f, alpha
  animationStart: number;
  animationLength: number;
  ease: Function;
  cursor: "pointer" | "default";

  narrowPhase(point: IInteractionPoint): boolean; //narrowPhase point collision detection
  pointCollision(point: IInteractionPoint): boolean;
  keyStateChange(key: IKeyState): void;
  active: boolean; //controlled by the stage
  hover: boolean; //controlled by the stage
  clicked: boolean; //controlled by the stage
  down: boolean; //controlled by the stage
  up: boolean; //controlled by the stage
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
  animationStart: number = 0;
  animationEnd: number = 0;
  ease: Function = easeLinear;
  cursor: ("pointer" | "default") = "default";
  animationLength: 400;
  active: boolean = false;
  hover: boolean = false;
  clicked: boolean = false;
  down: boolean = false;
  up: boolean = false;
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
  narrowPhase(point: IInteractionPoint): boolean {
    return false;
  }
  pointCollision(point: IInteractionPoint): boolean {
    return false;
  }
  keyStateChange(key: IKeyState): void {

  }
  update(): void {
    if (this.clicked) {
      super.emit("click", this);
    }
    if (this.down) {
      super.emit("down", this);
    }
    if (this.up) {
      super.emit("up", this);
    }
  }
  render(ctx: CanvasRenderingContext2D) {

  }
};

