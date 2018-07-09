import { IWorkerEvent } from "./IWorkerEvent";

export interface IPlaySoundEvent extends IWorkerEvent {
  type: "play-sound";
  props: {
    id: string;
    sound: string;
  };
}
