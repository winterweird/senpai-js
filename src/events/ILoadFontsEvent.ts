import { IWorkerEvent } from "./IWorkerEvent";

export interface ILoadFontsEvent extends IWorkerEvent {
  type: "load-fonts";
  props: {};
}
