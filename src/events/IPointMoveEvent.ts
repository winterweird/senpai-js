import { IWorkerEvent } from "./IWorkerEvent";

export interface IPointMoveEvent extends IWorkerEvent {
  type: "point-move";
  props: {
    id: string;
    pointID: string;
    x: number;
    y: number;
    tx: number;
    ty: number;
  };
}
