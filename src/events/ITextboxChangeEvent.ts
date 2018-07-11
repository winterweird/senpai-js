import { IPadding } from "../util";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ITextboxChangeEvent extends IWorkerEvent {
  type: "textbox-change";
  props: {
    id: string;
    lineHeight: number;
    padding: IPadding;
    textSpeed: number;
  };
}
