import { IWorkerEvent } from "./IWorkerEvent";

export interface IBatchEvent extends IWorkerEvent {
  type: "batch";
  props: {
    events: IWorkerEvent[];
  };
}
