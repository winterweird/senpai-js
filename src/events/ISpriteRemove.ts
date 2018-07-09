import { IWorkerEvent } from "./IWorkerEvent";

export interface ISpriteRemoveEvent extends IWorkerEvent {
  type: "sprite-remove";
  props: {
    id: string;
  }
};