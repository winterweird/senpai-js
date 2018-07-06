import { EventEmitter } from "events";
import { ISize, IInteractionPoint } from "../util/index";
import { ISprite } from "./Sprite";
import { transformPoint } from "../matrix";

export interface ITouchIndex {
  [id: string]: IInteractionPoint;
};

export interface IStageInteractionManagerProps extends ISize {
  selector: string;
};

export interface IStageInteractionManager {
  canvas: HTMLCanvasElement;
};

export class StageInteractionManager extends EventEmitter implements IStageInteractionManager {
  constructor(props: IStageInteractionManagerProps) {
    super();

    document.querySelector(props.selector).appendChild(this.canvas);
    this.canvas.width = props.width;
    this.canvas.height = props.height;
    this.hookEvents();
  }
  canvas: HTMLCanvasElement = document.createElement("canvas");
  private events: Array<Array<any>> = [
    [this.canvas, "mousedown", e => this.mouseDown(e)],
    [document.body, "mouseup", e => this.mouseUp(e)],
    [this.canvas, "mousemove", e => this.mouseMove(e)],
    [this.canvas, "touchstart", e => this.touchStart(e)],
    [document.body, "touchend", e => this.touchEnd(e)],
    [this.canvas, "touchmove", e => this.touchMove(e)],
    [document.body, "touchcancel", e => this.touchCancel(e)],
  ];

  private mousePoint: IInteractionPoint = {
    id: "mouse",
    captured: false,
    clicked: false,
    down: false,
    type: "Mouse",
    x: 0,
    y: 0,
    active: null,
    firstDown: false,
    tx: 0,
    ty: 0,
  };
  private pointIndex: ITouchIndex = {};
  protected points: IInteractionPoint[] = [this.mousePoint];
  private hookEvents(): void {
    this.events.forEach(event => event[0].addEventListener(event[1], event[2]));
  }
  protected dispose(): void {
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    this.events.forEach(event => event[0].removeEventListener(event[1], event[2]));
  }
  private touchStart(e: TouchEvent): void {
    const { changedTouches } = e;

    for (let i = 0; i < changedTouches.length; i++) {
      let touch = changedTouches[i];
      if (touch.target === this.canvas) {
        this.pointStart(touch);
      }
    }
  }
  private touchMove(e: TouchEvent): void {
    const { changedTouches } = e;

    for (let i = 0; i < changedTouches.length; i++) {
      let touch = changedTouches[1];
      if (touch.target === this.canvas) {
        const point = this.pointIndex[touch.identifier.toString()];
        this.pointMove(point, touch);
      }
    }
  }
  private touchEnd(e: TouchEvent) {
    const { changedTouches } = e;

    for (let i = 0; i < changedTouches.length; i++) {
      let touch = changedTouches[1];
      if (touch.target === this.canvas) {
        const point = this.pointIndex[touch.identifier.toString()];
        this.pointUp(point, touch);
        this.pointCancel(point, touch);
      }
    }
  }
  private touchCancel(e: TouchEvent): void {
    const { changedTouches } = e;

    for (let i = 0; i < changedTouches.length; i++) {
      let touch = changedTouches[1];
      if (touch.target === this.canvas) {
        const point = this.pointIndex[touch.identifier.toString()];
        this.pointCancel(point, touch);
      }
    }
  }
  private mouseUp(e: MouseEvent): void {
    return this.pointUp(this.mousePoint, e);
  }
  private mouseDown(e: MouseEvent): void {
    return this.pointDown(this.mousePoint, e);
  }
  private mouseMove(e: MouseEvent): void {
    return this.pointMove(this.mousePoint, e);
  }
  private pointUp(point: IInteractionPoint, e: MouseEvent | Touch): void {
    this.pointMove(point, e);
    point.clicked = true;
    point.down = false;
    if (point.active) {
      let sprite: ISprite = point.active;
      sprite.interpolate(Date.now());

      transformPoint(point, sprite.inverse);
      if (sprite.broadPhase(point) && sprite.narrowPhase(point) === sprite) {
        sprite.clicked = true;
        sprite.pointCollision(point);
        sprite.emit("point-move", sprite, point);
        sprite.emit("click", sprite, point);
      }
      sprite.active = false;
      point.active = null;
    } else {
      this.emit("click", this, point);
    }
  }
  private pointDown(point: IInteractionPoint, e: MouseEvent | Touch) {
    if (!point.down) {
      point.firstDown = true;
    }
    point.down = true;

    return this.pointMove(point, e);
  }
  private pointMove(point: IInteractionPoint, e: MouseEvent | Touch) {
    const rect: ClientRect = this.canvas.getBoundingClientRect();
    point.x = e.clientX - rect.left;
    point.y = e.clientY - rect.top;
  }
  private pointStart(e: Touch) {
    const point: IInteractionPoint = {
      id: e.identifier.toString(),
      x: 0,
      y: 0,
      captured: false,
      down: false,
      clicked: false,
      type: "Touch",
      active: null,
      firstDown: false,
      tx: 0,
      ty: 0,
    };
    this.pointIndex[e.identifier.toString()] = point;
    this.points.push(point);
    return this.pointDown(point, e);
  }
  private pointCancel(point: IInteractionPoint, e: Touch) {
    if (point.active) {
      point.active.active = false;
    }
    delete this.pointIndex[e.identifier.toString()];
    const index = this.points.indexOf(point);
    if (index !== -1) {
      this.points.splice(index, 1);
    }
  }
  protected cleanUp(): void {
    let point: IInteractionPoint;
    for (let i = 0; i < this.points.length; i++) {
      point = this.points[i]
      point.clicked = false;
      point.captured = false;
      point.firstDown = false;
      if (point.type === "Touch" && !point.down) {
        this.points.splice(i, 1);
        delete this.pointIndex[point.id];
        i -= 1;
      }
    }
  }
};