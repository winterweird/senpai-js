import { IWorkerEvent } from "./IWorkerEvent";

export interface IPointClickEvent extends IWorkerEvent {
  type: "point-click";
  props: {
    id: string;
    pointID: string;
    x: number;
    y: number;
    tx: number;
    ty: number;
  };
}
