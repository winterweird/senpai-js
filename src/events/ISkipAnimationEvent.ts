import { IWorkerEvent } from "./IWorkerEvent";

export interface ISkipAnimationEvent extends IWorkerEvent {
  type: "skip-animation";
  props: {}
};