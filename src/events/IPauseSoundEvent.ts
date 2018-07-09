import { IWorkerEvent } from "./IWorkerEvent";

export interface IPauseSoundEvent extends IWorkerEvent {
  type: "pause-sound";
  props: {
    id: string;
  };
}
