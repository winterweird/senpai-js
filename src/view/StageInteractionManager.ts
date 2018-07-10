import { EventEmitter } from "events";
import { ISize, IInteractionPoint } from "../util";
import { ISprite } from "./Sprite";
import { transformPoint } from "../matrix";

export interface ITouchIndex {
  [id: string]: IInteractionPoint;
}

export interface IStageInteractionManagerProps extends ISize {
  selector: string;
}

export interface IStageInteractionManager {
  canvas: HTMLCanvasElement;
}

interface IInteractionPointEvent {
  target: HTMLElement;
  event: string;
  listener: (e: MouseEvent | TouchEvent) => void;
}

export class StageInteractionManager extends EventEmitter implements IStageInteractionManager {

  public canvas: HTMLCanvasElement = document.createElement("canvas");

  private events: IInteractionPointEvent[] = [
    { target: this.canvas, event: "mousedown", listener: e => this.mouseDown(e as MouseEvent) },
    { target: document.body, event: "mouseup", listener: e => this.mouseUp(e as MouseEvent) },
    { target: this.canvas, event: "mousemove", listener: e => this.mouseMove(e as MouseEvent) },
    { target: this.canvas, event: "touchstart", listener: e => this.touchStart(e as TouchEvent) },
    { target: document.body, event: "touchend", listener: e => this.touchEnd(e as TouchEvent) },
    { target: this.canvas, event: "touchmove", listener: e => this.touchMove(e as TouchEvent) },
    { target: document.body, event: "touchcancel", listener: e => this.touchCancel(e as TouchEvent) },
  ];

  private mousePoint: IInteractionPoint = {
    active: null,
    captured: false,
    clicked: false,
    down: false,
    firstDown: false,
    id: "mouse",
    tx: 0,
    ty: 0,
    type: "Mouse",
    x: 0,
    y: 0,
  };

  // tslint:disable-next-line:member-ordering
  protected points: IInteractionPoint[] = [this.mousePoint];

  private pointIndex: ITouchIndex = {};

  constructor(props: IStageInteractionManagerProps) {
    super();

    document.querySelector(props.selector).appendChild(this.canvas);
    this.canvas.width = props.width;
    this.canvas.height = props.height;
    this.hookEvents();
  }

  protected dispose(): void {
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    this.events.forEach(event => event.target.removeEventListener(event.event, event.listener));
  }

  protected cleanUp(): void {
    let point: IInteractionPoint;
    for (let i = 0; i < this.points.length; i++) {
      point = this.points[i];
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

  private hookEvents(): void {
    this.events.forEach(event => event.target.addEventListener(event.event, event.listener));
  }

  private touchStart(e: TouchEvent): void {
    const { changedTouches } = e;
    let touch: Touch;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < changedTouches.length; i++) {
      touch = changedTouches[i];
      if (touch.target === this.canvas) {
        this.pointStart(touch);
      }
    }
  }

  private touchMove(e: TouchEvent): void {
    const { changedTouches } = e;
    let touch: Touch;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < changedTouches.length; i++) {
      touch = changedTouches[1];
      if (touch.target === this.canvas) {
        const point = this.pointIndex[touch.identifier.toString()];
        this.pointMove(point, touch);
      }
    }
  }

  private touchEnd(e: TouchEvent) {
    const { changedTouches } = e;
    let touch: Touch;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < changedTouches.length; i++) {
      touch = changedTouches[i];
      if (touch.target === this.canvas) {
        const point = this.pointIndex[touch.identifier.toString()];
        this.pointUp(point, touch);
        this.pointCancel(point, touch);
      }
    }
  }

  private touchCancel(e: TouchEvent): void {
    const { changedTouches } = e;
    let touch: Touch;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < changedTouches.length; i++) {
      touch = changedTouches[1];
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
      const sprite: ISprite = point.active;
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
      active: null,
      captured: false,
      clicked: false,
      down: false,
      firstDown: false,
      id: e.identifier.toString(),
      tx: 0,
      ty: 0,
      type: "Touch",
      x: 0,
      y: 0,
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
}
