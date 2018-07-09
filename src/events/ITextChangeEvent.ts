import { IWorkerEvent } from "./IWorkerEvent";

export interface ITextChangeEvent extends IWorkerEvent {
  type: "text-change";
  props: {
    id: string;
    font: string;
    fontSize: number;
    fontColor: string;
    text: string;
  }
};