
export interface ISprite {
  previousPosition: number[]; //a, b, c, d, e, f, alpha, z
  position: number[]; //a, b, c, d, e, f, alpha, z

  //animation properties
  interpolatedPosition: number[]; //a, b, c, d, e, f, alpha, z
  animationStart: number;
  animationLength: number;
  ease: Function;

  //
  cursor: "pointer" | "default";
  narrowPhase(): boolean; //return true if narrowphase detects mouse collision
  active: boolean;
  hover: boolean; //this property is controlled by the stage
  clicked: boolean; //this property is controlled by the stage
  down: boolean;
  update(mouse: IMouseData, keys: IKeyData, touches: ITouchData): void;
  render(ctx: CanvasRenderingContext2D): void;
}