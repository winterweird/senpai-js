import { IWorkerEvent } from "./IWorkerEvent";

export interface IStopSoundEvent extends IWorkerEvent {
  type: "stop-sound";
  props: {
    id: string;
  };
}
