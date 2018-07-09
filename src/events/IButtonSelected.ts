import { IWorkerEvent } from "./IWorkerEvent";

export interface IButtonSelectedEvent extends IWorkerEvent {
  type: "button-selected";
  props: {
    id: string;
    selected: boolean;
  };
}
