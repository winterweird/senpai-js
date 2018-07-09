import { IWorkerEvent } from "./IWorkerEvent";

export interface ITextboxAppendEvent extends IWorkerEvent {
  type: "textbox-append";
  props: {
    id: string;
    append: string;
  }
};