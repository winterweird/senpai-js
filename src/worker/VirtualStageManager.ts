import { IBatchEvent } from "../events/IBatchEvent";
import { IPointClickEvent } from "../events/IPointClickEvent";
import { IPointMoveEvent } from "../events/IPointMoveEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { IInteractionPoint } from "../util";
import { IVirtualStage, VirtualStage } from "../virtualStage";
import { IVirtualActor } from "../virtualStage/VirtualActor";

export interface IVirtualStageManager extends IVirtualStage {
  handle(event: IWorkerEvent): Promise<void>;
}

const createPoint =  (): IInteractionPoint => ({
  active: null,
  captured: false,
  clicked: false,
  down: false,
  firstDown: false,
  id: "",
  tx: 0,
  ty: 0,
  type: "Mouse",
  x: 0,
  y: 0,
});

interface IInteractionPointMap {
  [key: string]: IInteractionPoint;
}

export class VirtualStageManager extends VirtualStage implements IVirtualStageManager {
  private points: IInteractionPointMap = {};
  private index: number = -1;
  private script: Generator = require("../../script/");
  private handling: Promise<void> = Promise.resolve();

  constructor() {
    super();
  }

  public handle(event: IWorkerEvent): Promise<void> {
    return this.handling = this.handling
      .catch(error => console.log(error))
      .then(e => this.handleEvent(event));
  }

  private async handleEvent(event: IWorkerEvent): Promise<void> {
    if (event.type === "batch") {
      for (const e of (event as IBatchEvent).props.events) {
        await this.handleEvent(e);
      }
      return;
    }

    if (event.type === "point-move") {
      await this.handlePointMove(event as IPointMoveEvent);
      return;
    }

    if (event.type === "point-click") {
      await this.handlePointClick(event as IPointClickEvent);
      return;
    }
  }

  private async handlePointMove(event: IPointMoveEvent): Promise<void> {
    const point: IInteractionPoint = this.points[event.props.pointID] || createPoint();
    point.id = event.props.pointID;
    point.x = event.props.x;
    point.y = event.props.y;
    point.tx = event.props.tx;
    point.ty = event.props.ty;
    this.points[point.id] = point;

    const actor: IVirtualActor = this.actorIndex[event.props.id];
    if (actor) {
      this.emit("point-move:" + actor.id, point);
    }
  }

  private async handlePointClick(event: IPointClickEvent): Promise<void> {
    const point: IInteractionPoint = this.points[event.props.pointID] || createPoint();
    point.id = event.props.pointID;
    point.x = event.props.x;
    point.y = event.props.y;
    point.tx = event.props.tx;
    point.ty = event.props.ty;
    this.points[point.id] = point;

    const actor: IVirtualActor = this.actorIndex[event.props.id];
    if (actor) {
      this.emit("point-click:" + actor.id, point);
    }
  }
}
