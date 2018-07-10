import { IWorkerEvent } from "./IWorkerEvent";

export interface ISpriteMoveEvent extends IWorkerEvent {
  type: "sprite-move";
  props: {
    id: string;
    position: number[] | Float64Array;
    alpha: number;
    z: number;
    timespan: number;
    ease: string;
    wait: number;
  };
}
