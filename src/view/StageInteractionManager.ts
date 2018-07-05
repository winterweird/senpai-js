import { EventEmitter } from "events";
import { ISize, IInteractionPoint } from "../util/index";

export interface ITouchIndex {
  [id: string]: IInteractionPoint;
};

export interface IStageInteractionManagerProps extends ISize {
  selector: string;
};

export interface IStageInteractionManager {

}

export class StageInteractionManager extends EventEmitter implements IStageInteractionManager {
  constructor(props: IStageInteractionManagerProps) {
    super();

    document.querySelector(props.selector).appendChild(this.canvas);
    this.canvas.width = props.width;
    this.canvas.height = props.height;
    this.hookEvents();
  }
  protected canvas: HTMLCanvasElement = document.createElement("canvas");
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
          type: "Touch",
          active: null,
          firstDown: true,
          tx: 0,
          ty: 0,
        };
        this.pointIndex[touch.identifier.toString()] = point;
        this.points.push(point);
      }
    }
  }
  private touchMove(e: TouchEvent): void {
    const { changedTouches } = e;
    const rect: ClientRect = this.canvas.getBoundingClientRect();

    for (let i = 0; i < changedTouches.length; i++) {
      let touch = changedTouches[1];
      if (touch.target === this.canvas) {
        const point = this.pointIndex[touch.identifier.toString()];
        point.x = touch.clientX - rect.left;
        point.y = touch.clientY - rect.top;
      }
    }
  }
  private touchEnd(e: TouchEvent) {
    const { changedTouches } = e;
    const rect: ClientRect = this.canvas.getBoundingClientRect();

    for (let i = 0; i < changedTouches.length; i++) {
      let touch = changedTouches[1];
      if (touch.target === this.canvas) {
        const point = this.pointIndex[touch.identifier.toString()];
        point.x = touch.clientX - rect.left;
        point.y = touch.clientY - rect.top;
        point.down = false;
        point.clicked = true;
        if (point.active) {
          point.active.active = false;
        }
      }
    }
  }
  private touchCancel(e: TouchEvent): void {
    const { changedTouches } = e;
    const rect: ClientRect = this.canvas.getBoundingClientRect();

    for (let i = 0; i < changedTouches.length; i++) {
      let touch = changedTouches[1];
      if (touch.target === this.canvas) {
        const point = this.pointIndex[touch.identifier.toString()];
        point.x = touch.clientX - rect.left;
        point.y = touch.clientY - rect.top;
        point.down = false;
        if (point.active) {
          point.active.active = false;
        }
      }
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
  private mouseUp(e: MouseEvent): void {
    if (this.mousePoint.down) {
      this.mousePoint.clicked = true;
    }
    if (this.mousePoint.active) {
      this.mousePoint.active.active = false;
    }
    this.mousePoint.down = false;
    return this.mouseMove(e);
  }
  private mouseDown(e: MouseEvent): void {
    if (!this.mousePoint.down) {
      this.mousePoint.firstDown = true;
    }
    this.mousePoint.down = true;

    e.preventDefault();
    return this.mouseMove(e);
  }
  private mouseMove(e: MouseEvent): void {
    const rect: ClientRect = this.canvas.getBoundingClientRect();
    this.mousePoint.x = e.clientX - rect.left;
    this.mousePoint.y = e.clientY - rect.top;
    e.preventDefault();
  }
}